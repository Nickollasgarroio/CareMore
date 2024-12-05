/* eslint-disable no-console */
import { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  Button,
  Spacer,
  Input,
  DatePicker,
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate } from "@internationalized/date";
import { useHookFormMask } from "use-mask-input";

import { PacFormData } from "@/types/FormDataTypes";
import formSchema from "@/schemas/formSchemas";
import { supabase } from "@/supabaseClient";
import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";
import { BgCard } from "@/components/bg-card";
import { BackButton } from "@/components/BackButton";

// import goBack from "@/assets/svg/goBack.svg";

// Função para calcular a idade do paciente
const calcularIdadePaciente = (dataNascimento: string | Date): number => {
  const hoje = new Date();
  const nascimento =
    typeof dataNascimento === "string"
      ? new Date(dataNascimento)
      : dataNascimento;

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  // Se o mês atual for anterior ao mês de nascimento, ou for o mês de nascimento mas o dia atual for anterior ao de nascimento, subtrai 1 ano.
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade;
};

// Hook para buscar dados do Supabase
const useFetchPacientes = () => {
  const [dataTeste, setDataTeste] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: pacientes, error } = await supabase
      .from("pacientes")
      .select("*");

    if (error) {
      setError("Erro ao buscar pacientes");
      setDataTeste([]);
    } else {
      setDataTeste(pacientes);
    }
    setLoading(false);
  };

  return { dataTeste, loading, error, fetchData };
};

export default function ProntuariosPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    getValues,
  } = useForm<PacFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
    mode: "onChange",
  });
  const registerWithMask = useHookFormMask(register);

  const { dataTeste, loading, fetchData } = useFetchPacientes();

  useEffect(() => {
    fetchData();
  }, []);

  const [
    initialData = {
      name: "",
      sex: "",
      whatsapp: "",
      cpf: "",
      birth_date: "",
      email: "",
      addrs_street_name: "",
      addrs_num: "",
      addrs_bairro: "",
      addrs_city: "",
      addrs_uf: "",
      addrs_zip: "",
      addrs_comp: "",
      pac_has_resp: false,
      resp_name: "",
      resp_email: "",
      resp_whatsapp: "",
      resp_education: "",
      resp_occupation: "",
      prof_id: "",
    },
    setInitialData,
  ] = useState<PacFormData | null>(null);

  const handleSelectPaciente = async (id: string) => {
    const { data: paciente, error } = await supabase
      .from("pacientes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar paciente:", error);

      return;
    }

    // Atualiza os valores do formulário com os dados do paciente
    if (paciente) {
      const fieldsToUpdate = {
        name: paciente.name || "", // Se o valor não existir, atribui uma string vazia
        sex: paciente.sex || "",
        whatsapp: paciente.whatsapp || "",
        cpf: paciente.cpf || "",
        birth_date: paciente.birth_date || "",
        email: paciente.email || "",
        addrs_street_name: paciente.addrs_street_name || "",
        addrs_num: paciente.addrs_num || "",
        addrs_bairro: paciente.addrs_bairro || "",
        addrs_city: paciente.addrs_city || "",
        addrs_uf: paciente.addrs_uf || "",
        addrs_zip: paciente.addrs_zip || "",
        addrs_has_comp: paciente.addrs_has_comp || "",
        addrs_comp: paciente.addrs_comp || "",
        pac_has_resp: paciente.pac_has_resp || "",
        resp_name: paciente.resp_name || "",
        resp_email: paciente.resp_email || "",
        resp_whatsapp: paciente.resp_whatsapp || "",
        resp_education: paciente.resp_education || "",
        resp_occupation: paciente.resp_occupation || "",
      };

      // Atualiza todos os campos do formulário
      setInitialData(paciente); // Armazena dados originais
      Object.entries(fieldsToUpdate).forEach(([field, value]) => {
        setValue(field as keyof PacFormData, value, { shouldValidate: true });
      });
    }
  };
  const handleEditing = () => {
    setIsEditing(!isEditing);
  };
  const [isEditing, setIsEditing] = useState(true);

  return (
    <DefaultLayout>
      <form action="">
        <div className="w-[400px] flex flex-col gap-4 mx-auto">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-16">
              <BackButton />
              <h1 className={title({ color: "blue" })}>Prontuários</h1>
            </div>
            <h1 className={subtitle()}>Cadastro</h1>
          </div>
          <Spacer />
          <div className="flex flex-col gap-4">
            <BgCard className="flex flex-col gap-4">
              <Controller
                control={control}
                name="prof_id"
                render={({ field }) => (
                  <Select
                    label="Nome Completo"
                    labelPlacement="outside"
                    placeholder="Selecione um paciente"
                    value={field.value}
                    onChange={(event) => {
                      const value = event.target.value;

                      field.onChange(value);
                      handleSelectPaciente(value);
                    }}
                  >
                    {dataTeste
                      .filter((paciente) => !!paciente)
                      .map((paciente) => (
                        <SelectItem key={paciente.id} value={paciente.id}>
                          {loading ? "Carregando..." : paciente.name}
                        </SelectItem>
                      ))}
                  </Select>
                )}
              />
              <div className="flex gap-4">
                <Controller
                  control={control}
                  name="birth_date"
                  render={({ field }) => (
                    <DatePicker
                      className="w-3/4"
                      isDisabled={isEditing}
                      label="Data de Nascimento"
                      labelPlacement="outside"
                      value={field.value ? parseDate(field.value) : undefined}
                      onChange={(date) => field.onChange(date?.toString())}
                    />
                  )}
                />
                <Input
                  isDisabled
                  className="w-1/4"
                  label="Idade"
                  labelPlacement="outside"
                  placeholder="Idade"
                  value={
                    getValues("birth_date")
                      ? calcularIdadePaciente(
                          getValues("birth_date")
                        ).toString()
                      : ""
                  }
                  onChange={() => null}
                />
              </div>
              <Input
                isDisabled={isEditing}
                label="Sexo"
                labelPlacement="outside"
                placeholder="Sexo"
                value={getValues("sex") || ""}
              />
              <Input
                isDisabled={isEditing}
                label="Telefone"
                labelPlacement="outside"
                placeholder="Telefone"
                value={initialData?.whatsapp || ""}
                {...registerWithMask("whatsapp", "99 99999-9999")}
              />
              <Input
                isDisabled={isEditing}
                label="Email"
                labelPlacement="outside"
                placeholder="Email"
                value={getValues("email") || ""}
                onChange={() => null}
              />
            </BgCard>
            <Spacer />
            <BgCard className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">Endereço</h2>
              <Input
                isDisabled={isEditing}
                label="CEP"
                labelPlacement="outside"
                placeholder="CEP"
                value={getValues("addrs_zip") || ""}
                onChange={() => null}
              />
              <div className="flex gap-4">
                <Input
                  className="w-3/4"
                  isDisabled={isEditing}
                  label="Endereço"
                  labelPlacement="outside"
                  placeholder="Endereço"
                  value={getValues("addrs_street_name") || ""}
                  onChange={() => setValue("addrs_street_name", "")}
                />
                <Input
                  className="w-1/4"
                  isDisabled={isEditing}
                  label="Número"
                  labelPlacement="outside"
                  placeholder="Número"
                  value={getValues("addrs_num") || ""}
                  onChange={() => null}
                />
              </div>
              <div className="flex gap-4">
                <Input
                  className="w-3/4"
                  isDisabled={isEditing}
                  label="Bairro"
                  labelPlacement="outside"
                  placeholder="Bairro"
                  value={getValues("addrs_bairro") || ""}
                  onChange={() => null}
                />
                <Input
                  className="w-1/4"
                  isDisabled={isEditing}
                  label="UF"
                  labelPlacement="outside"
                  placeholder="UF"
                  value={getValues("addrs_uf") || ""}
                  onChange={() => null}
                />
              </div>
            </BgCard>
            <Spacer />
            <BgCard className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">Responsável</h2>
              <Input
                isDisabled={isEditing}
                label="Nome Completo"
                labelPlacement="outside"
                placeholder="Responsável"
                value={getValues("resp_name") || ""}
                onChange={() => null}
              />
              <Input
                isDisabled={isEditing}
                label="Telefone"
                labelPlacement="outside"
                placeholder="Telefone"
                value={getValues("resp_whatsapp") || ""}
                onChange={() => null}
              />
              <Input
                isDisabled={isEditing}
                label="Email"
                labelPlacement="outside"
                placeholder="Email"
                value={getValues("resp_email") || ""}
                onChange={() => null}
              />
              <Input
                isDisabled={isEditing}
                label="Ocupação"
                labelPlacement="outside"
                placeholder="Ocupação"
                value={getValues("resp_occupation") || ""}
                onChange={() => null}
              />

              <Input
                isDisabled={isEditing}
                label="Educação"
                labelPlacement="outside"
                placeholder="Educação"
                value={getValues("resp_education") || ""}
                onChange={() => null}
              />
            </BgCard>
          </div>
          <div className="flex">
            <Button className="w-fit mx-auto" color="primary" type="submit">
              Enviar
            </Button>
            <Button
              className="w-fit mx-auto"
              color="primary"
              onPress={handleEditing}
            >
              Editar
            </Button>
          </div>
          <pre>{JSON.stringify(initialData, null, 2)}</pre>
        </div>
      </form>
    </DefaultLayout>
  );
}
