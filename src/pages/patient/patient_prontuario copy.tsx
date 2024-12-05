/* eslint-disable no-console */
import {
  Card,
  CardBody,
  DatePicker,
  Divider,
  Input,
  Spacer,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getLocalTimeZone,
  today,
  DateValue,
  parseDate,
} from "@internationalized/date";

import { useAuth } from "@/providers/AuthProvider";
import { BackButton } from "@/components/BackButton";
import DefaultLayout from "@/layouts/default";
import { supabase } from "@/supabaseClient";
import { EvolucaoType, PacFormData } from "@/types/FormDataTypes";
import withAuth from "@/hocs/withAuth";
import { calculateAge } from "@/utils/calculateAge";
import formSchema from "@/schemas/formSchemas";

function PacienteProntuario() {
  const location = useLocation();
  const { session } = useAuth();
  const [paciente, setPaciente] = useState<PacFormData>();
  const [evolucao, setEvolucao] = useState<EvolucaoType>();
  const [error, setError] = useState<string | null>(null);

  ("");

  const pacId = location.state.pac_id;
  const idade = calculateAge(paciente?.birth_date || "");

  const handleDateChange = (value: DateValue | null) => {
    if (value) {
      const formattedDate = value.toString(); // Convert to string

      setValue("birth_date", formattedDate);
    } else {
      setValue("birth_date", ""); // Clear the value if null
    }
  };

  const { onOpen, isOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchPatientProfile = async () => {
      if (session?.user.id) {
        const { data, error } = await supabase
          .from("pacientes")
          .select("*")
          .eq("prof_id", session.user.id)
          .eq("pac_id", pacId)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar perfil:", error.message);
        } else if (data) {
          // console.log("Dados recuperados:", data);
          setPaciente(data);
        }
      }
    };

    fetchPatientProfile();
  }, [session, pacId]);

  useEffect(() => {
    const fetchPatientEvolucao = async () => {
      if (session?.user.id) {
        const { data, error } = await supabase
          .from("evolucoes")
          .select("*")
          .eq("prof_id", session.user.id)
          .eq("pac_id", pacId)
          .order("created_at", { ascending: false }) // Ordena pela data de criação mais recente
          .limit(1); // Limita a apenas 1 registro

        if (error) {
          console.error("Erro ao buscar evolução:", error.message);
        } else if (data) {
          console.log("Dados recuperados:", data);
          setEvolucao(data[0]); // <- Está atualizando o estado errado!
        }
      }
    };

    fetchPatientEvolucao();
  }, [session, pacId]);

  const methods = useForm<PacFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      prof_id: session?.user.id,
      pac_id: paciente?.pac_id,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    getValues,
    watch, // Import this function
  } = methods;

  const onSubmitSupabase = async (data: PacFormData) => {
    // Enviar dados para o Supabase
    const { error } = await supabase.from("pacientes").insert([data]);

    if (error) {
      console.log(error);
      setError(error.message);
    } else {
      console.log(`Paciente Cadastrado com sucesso`);
    }
    onOpen();

    // Exibir o modal independentemente do resultado, com mensagem de sucesso ou erro
    // setModalVisible(true);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col max-w-[400px] mx-auto">
        <BackButton subtitulo="Ver prontuarios" titulo="Prontuarios" />
      </section>
      <div className="flex flex-col w-[90%] max-w-[600px] mx-auto gap-4">
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <form noValidate onSubmit={handleSubmit(onSubmitSupabase)}>
              <div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold">{paciente?.name}</h1>
                  <p className="text-sm">
                    {paciente?.sex}, {idade}
                  </p>
                </div>
                <Spacer y={2} />
                <div className="flex gap-4 justify-center">
                  <p className="text-xs text-foreground-500">Atendimentos: 4</p>
                  <p className="text-xs text-foreground-500">Faltas: 4</p>
                </div>

                <Spacer y={4} />
                <Divider className="" />
                <Spacer y={4} />
              </div>

              <Tabs className="">
                <Tab
                  key="pessoal"
                  className="flex flex-col gap-4"
                  title="Pessoal"
                >
                  <Input
                    className=""
                    label="Nome Completo"
                    labelPlacement="outside"
                    placeholder="Júlia"
                    value={paciente?.name}
                    {...register("name")}
                  />
                  <Input
                    label="Sexo"
                    labelPlacement="outside"
                    placeholder="Feminino"
                    value={paciente?.sex}
                    {...register("sex")}
                  />
                  <div className="flex gap-4">
                    <Controller
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          isRequired
                          label="Data de Nascimento"
                          labelPlacement="outside"
                          maxValue={today(getLocalTimeZone())}
                          value={
                            paciente?.birth_date
                              ? parseDate(paciente?.birth_date)
                              : null
                          }
                          onChange={(date) =>
                            field.onChange(date?.toString() || "")
                          }
                        />
                      )}
                      {...register("birth_date")}
                    />

                    <Input
                      className="w-1/4"
                      label="Idade"
                      labelPlacement="outside"
                      placeholder="26"
                      value={idade.toString()}
                    />
                  </div>
                  <Input
                    label="CPF"
                    labelPlacement="outside"
                    placeholder="111.111.111-11"
                    value={paciente?.cpf}
                  />
                </Tab>

                <Tab
                  key="Endereço"
                  className="flex flex-col gap-4"
                  title="Endereço"
                >
                  <div className="flex gap-4">
                    <Input
                      className="w-3/4"
                      label="Rua"
                      labelPlacement="outside"
                      placeholder="Av. Paulista"
                      value={paciente?.addrs_street_name}
                    />
                    <Input
                      className="w-1/4"
                      label="Número"
                      labelPlacement="outside"
                      placeholder="Av. Paulista"
                      value={paciente?.addrs_num}
                    />
                  </div>
                  <Input
                    label="Bairro"
                    labelPlacement="outside"
                    placeholder="3000"
                    value={paciente?.addrs_bairro}
                  />
                  <div className="flex gap-4">
                    <Input
                      className="w-3/4"
                      label="Cidade"
                      labelPlacement="outside"
                      placeholder="São Paulo"
                      value={paciente?.addrs_city}
                    />
                    <Input
                      className="w-1/4"
                      label="Estado"
                      labelPlacement="outside"
                      placeholder="SP"
                      value={paciente?.addrs_uf}
                    />
                  </div>
                </Tab>
                <Tab
                  key="Contato"
                  className="flex flex-col gap-4"
                  title="Contato"
                >
                  <Input
                    label="Email"
                    labelPlacement="outside"
                    placeholder="julia.profissional@teste.com"
                    type="email"
                    value={paciente?.email}
                  />
                  <Input
                    label="Telefone"
                    labelPlacement="outside"
                    placeholder="11 99999-9999"
                    value={paciente?.whatsapp}
                  />
                </Tab>
                <Tab
                  key="Responsável"
                  className="flex flex-col gap-4"
                  isDisabled={!paciente?.pac_has_resp}
                  title="Responsável"
                >
                  <Input
                    label="Nome"
                    labelPlacement="outside"
                    placeholder="Nickollas Giordano"
                    value={paciente?.resp_name || ""}
                  />
                  <Input
                    label="Ocupação"
                    labelPlacement="outside"
                    placeholder="Programador"
                    value={paciente?.resp_occupation || ""}
                  />
                  <Input
                    label="Escolaridade"
                    labelPlacement="outside"
                    placeholder="Superior Completo"
                    value={paciente?.resp_education || ""}
                  />
                  <Divider />
                  <Input
                    label="Email"
                    labelPlacement="outside"
                    placeholder="nickollas.profissional@teste.com"
                    type="email"
                    value={paciente?.resp_email}
                  />

                  <Input
                    label="Telefone"
                    labelPlacement="outside"
                    placeholder="11 99999-9999"
                    value={paciente?.resp_whatsapp}
                  />
                </Tab>
              </Tabs>
            </form>
          </Card>
          <Card>
            <CardBody className="flex flex-col gap-4">
              <h1 className="text-xl mx-auto my-2">Evolução mais recente</h1>
              <Divider />
              <div className="ml-2">
                <p className="text-sm">Queixa</p>
                <Input isDisabled value={evolucao?.queixa} />
              </div>
              <div className="ml-2">
                <p className="text-sm">Observação</p>
                <Textarea
                  isDisabled
                  labelPlacement="outside"
                  minRows={10}
                  placeholder="Observações"
                  value={evolucao?.observacao}
                />
              </div>
            </CardBody>
          </Card>
        </div>
        <Link
          className=" hover:text-blue-500  transition-all duration-300"
          state={{
            pac: paciente,
          }}
          to={"/patient/evolucao/list"}
        >
          <p>oi</p>
        </Link>
      </div>
    </DefaultLayout>
  );
}

export default withAuth(PacienteProntuario);
