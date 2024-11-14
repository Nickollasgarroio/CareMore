/* eslint-disable no-console */
import { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  Button,
  Spacer,
  Input,
  DatePicker,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate } from "@internationalized/date";

import { PacFormData } from "@/types/FormDataTypes";
import formSchema from "@/schemas/formSchemas";
import { supabase } from "@/supabaseClient";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { BgCard } from "@/components/bg-card";
import { useHookFormMask } from "use-mask-input";
import { BackButton } from "@/components/BackButton";
import { DefaultProfilePic } from "@/assets/BackSVG";

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

export default function PacEvolucaoPage() {
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
      pac_name: "",
      pac_sex: "",
      pac_whatsapp: "",
      pac_cpf: "",
      pac_birth_date: "",
      pac_email: "",
      pac_addrs_street_name: "",
      pac_addrs_num: "",
      pac_addrs_bairro: "",
      pac_addrs_city: "",
      pac_addrs_uf: "",
      pac_addrs_zip: "",
      pac_addrs_comp: "",
      pac_has_resp: false,
      pac_resp_name: "",
      pac_resp_email: "",
      pac_resp_whatsapp: "",
      pac_resp_education: "",
      pac_resp_occupation: "",
      pac_id: "",
    },
    setInitialData,
  ] = useState<PacFormData | null>(null);

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
          <div className="flex flex-row gap-16">
            <BackButton />
            <h1 className={title({ color: "blue" })}>Prontuários</h1>
          </div>
          <Spacer />
          <Card>
            <CardBody className=" flex flex-row justify-between items-baseline py-4">
              <div className="flex flex-row gap-4">
                <DefaultProfilePic size={100} />
                <div className="flex flex-col">
                  <div className="text-blue-500 font-bold text-xl">
                    João Gomes Willian de Souza
                  </div>
                  <div className="flex flex-row">
                    <div className="text-sm">
                      <p>
                        <span className="font-bold">Idade:</span> 2 anos e 7
                        meses
                      </p>
                      <p>
                        <span className="font-bold">Atendimentos:</span> 10
                      </p>
                      <p>
                        <span className="font-bold">Faltas:</span> 2
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Button color="primary" size="sm" className="w-fit">
                Ver Mais
              </Button>
            </CardBody>
          </Card>

          {/* <pre>{JSON.stringify(initialData, null, 2)}</pre> */}
        </div>
      </form>
    </DefaultLayout>
  );
}
