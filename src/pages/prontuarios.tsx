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

import FormData from "@/types/FormDataTypes";
import formSchema from "@/schemas/formSchemas";
import { supabase } from "@/supabaseClient";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { BgCard } from "@/components/bg-card";

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
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
    mode: "onChange",
  });

  const { dataTeste, loading, fetchData } = useFetchPacientes();

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectPaciente = async (pac_id: string) => {
    const { data: paciente, error } = await supabase
      .from("pacientes")
      .select("*")
      .eq("pac_id", pac_id)
      .single();

    if (error) {
      console.error("Erro ao buscar paciente:", error);

      return;
    }

    // Atualiza os valores do formulário com os dados do paciente
    if (paciente) {
      const fieldsToUpdate = {
        pac_name: paciente.pac_name || "", // Se o valor não existir, atribui uma string vazia
        pac_sex: paciente.pac_sex || "",
        pac_whatsapp: paciente.pac_whatsapp || "",
        pac_cpf: paciente.pac_cpf || "",
        pac_birth_date: paciente.pac_birth_date || "",
        pac_email: paciente.pac_email || "",
        pac_addrs_street_name: paciente.pac_addrs_street_name || "",
        pac_addrs_num: paciente.pac_addrs_num || "",
        pac_addrs_bairro: paciente.pac_addrs_bairro || "",
        pac_addrs_city: paciente.pac_addrs_city || "",
        pac_addrs_uf: paciente.pac_addrs_uf || "",
        pac_addrs_zip: paciente.pac_addrs_zip || "",
        pac_addrs_has_comp: paciente.pac_addrs_has_comp || "",
        pac_addrs_comp: paciente.pac_addrs_comp || "",
        pac_has_resp: paciente.pac_has_resp || "",
        pac_resp_name: paciente.pac_resp_name || "",
        pac_resp_email: paciente.pac_resp_email || "",
        pac_resp_whatsapp: paciente.pac_resp_whatsapp || "",
        pac_resp_education: paciente.pac_resp_education || "",
        pac_resp_occupation: paciente.pac_resp_occupation || "",
      };

      // Atualiza todos os campos do formulário
      Object.entries(fieldsToUpdate).forEach(([field, value]) => {
        setValue(field as keyof FormData, value, { shouldValidate: true });
      });
    }
  };

  return (
    <DefaultLayout>
      <form action="">
        <div className="w-[400px] flex flex-col gap-4 mx-auto">
          <h1 className={title()}>Prontuário</h1>
          <Spacer />
          <div className="flex flex-col gap-4">
            <BgCard className="flex flex-col gap-4">
              <Controller
                control={control}
                name="pac_id"
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
                        <SelectItem
                          key={paciente.pac_id}
                          value={paciente.pac_id}
                        >
                          {loading ? "Carregando..." : paciente.pac_name}
                        </SelectItem>
                      ))}
                  </Select>
                )}
              />
              <div className="flex gap-4">
                <Controller
                  control={control}
                  name="pac_birth_date"
                  render={({ field }) => (
                    <DatePicker
                      isDisabled
                      className="w-3/4"
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
                    getValues("pac_birth_date")
                      ? calcularIdadePaciente(
                          getValues("pac_birth_date")
                        ).toString()
                      : ""
                  }
                  onChange={() => null}
                />
              </div>
              <Input
                isDisabled
                label="Sexo"
                labelPlacement="outside"
                placeholder="Sexo"
                value={getValues("pac_sex") || ""}
                onChange={() => null}
              />
              <Input
                isDisabled
                label="Telefone"
                labelPlacement="outside"
                placeholder="Telefone"
                value={getValues("pac_whatsapp") || ""}
                onChange={() => null}
              />
              <Input
                isDisabled
                label="Email"
                labelPlacement="outside"
                placeholder="Email"
                value={getValues("pac_email") || ""}
                onChange={() => null}
              />
            </BgCard>
            <Spacer />
            <BgCard className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">Endereço</h2>
              <Input
                isDisabled
                label="CEP"
                labelPlacement="outside"
                placeholder="CEP"
                value={getValues("pac_addrs_zip") || ""}
                onChange={() => null}
              />
              <div className="flex gap-4">
                <Input
                  isDisabled
                  className="w-3/4"
                  label="Endereço"
                  labelPlacement="outside"
                  placeholder="Endereço"
                  value={getValues("pac_addrs_street_name") || ""}
                  onChange={() => null}
                />
                <Input
                  isDisabled
                  className="w-1/4"
                  label="Número"
                  labelPlacement="outside"
                  placeholder="Número"
                  value={getValues("pac_addrs_num") || ""}
                  onChange={() => null}
                />
              </div>
              <div className="flex gap-4">
                <Input
                  isDisabled
                  className="w-3/4"
                  label="Bairro"
                  labelPlacement="outside"
                  placeholder="Bairro"
                  value={getValues("pac_addrs_bairro") || ""}
                  onChange={() => null}
                />
                <Input
                  isDisabled
                  className="w-1/4"
                  label="UF"
                  labelPlacement="outside"
                  placeholder="UF"
                  value={getValues("pac_addrs_uf") || ""}
                  onChange={() => null}
                />
              </div>
            </BgCard>
            <Spacer />
            <BgCard className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">Responsável</h2>
              <Input
                
                label="Nome Completo"
                labelPlacement="outside"
                placeholder="Responsável"
                value={getValues("pac_resp_name") || ""}
                onChange={() => null}
              />
              <Input
                isDisabled
                label="Telefone"
                labelPlacement="outside"
                placeholder="Telefone"
                value={getValues("pac_resp_whatsapp") || ""}
                onChange={() => null}
              />
              <Input
                isDisabled
                label="Email"
                labelPlacement="outside"
                placeholder="Email"
                value={getValues("pac_resp_email") || ""}
                onChange={() => null}
              />
              <Input
                isDisabled
                label="Ocupação"
                labelPlacement="outside"
                placeholder="Ocupação"
                value={getValues("pac_resp_occupation") || ""}
                onChange={() => null}
              />

              <Input
                isDisabled
                label="Educação"
                labelPlacement="outside"
                placeholder="Educação"
                value={getValues("pac_resp_education") || ""}
                onChange={() => null}
              />
            </BgCard>
          </div>
          <Button className="w-fit mx-auto" color="primary" type="submit">
            Enviar
          </Button>
        </div>
      </form>
    </DefaultLayout>
  );
}
