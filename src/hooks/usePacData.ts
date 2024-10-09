import { useState, useMemo } from "react";
import { z } from "zod";
import { DateValue } from "@internationalized/date";

import { formatCPF, isValidCPF } from "@/utils/cpfUtils";
import { isValidPhone } from "@/utils/phoneUtils";
import { isValidZipCode } from "@/utils/zipUtils";
import { supabase } from "@/supabaseClient";
import { cadastroSchema } from "@/schemas/formSchemas";
import { PacData } from "@/types/pacDataTypes"; // Altere o caminho 


export default function usePacFormState() {
  const [pacDataState, setPacDataState] = useState<PacData>({
    pac_name: { value: "", required: true },
    pac_sex: { value: "", required: true },
    pac_whatsapp: { value: "", required: true },
    pac_cpf: { value: "", required: true },
    pac_birth_date: { value: "", required: true },
    pac_email: { value: "", required: true },
    pac_addrs_street_name: { value: "", required: true },
    pac_addrs_num: { value: "", required: true },
    pac_addrs_zip: { value: "", required: true },
    pac_addrs_has_comp: { value: true, required: true },
    pac_addrs_comp: { value: "", required: true },
    pac_has_resp: { value: true, required: false },
    pac_resp_name: { value: "", required: true },
    pac_resp_email: { value: "", required: true },
    pac_resp_whatsapp: { value: "", required: true },
    pac_resp_education: { value: "", required: true },
    pac_resp_ocupation: { value: "", required: true },
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const requiredFields = [
    "pac_name",
    "pac_sex",
    "pac_whatsapp",
    "pac_cpf",
    "pac_birth_date",
    "pac_email",
    "pac_addrs_street_name",
    "pac_addrs_num",
    "pac_addrs_zip",
    "pac_addrs_comp",
    "pac_resp_name",
    "pac_resp_email",
    "pac_resp_whatsapp",
    "pac_resp_education",
    "pac_resp_ocupation",
  ];

  // Função para atualizar o estado de um campo
  // Função para atualizar o estado de um campo
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    // Se for um checkbox, use o atributo checked
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement; // Asserção de tipo para checkbox

      setPacDataState((prevState) => ({
        ...prevState,
        [name]: {
          ...prevState[name as keyof PacData],
          value: target.checked, // Acessa checked para checkboxes
        },
      }));
    } else {
      setPacDataState((prevState) => ({
        ...prevState,
        [name]: {
          ...prevState[name as keyof PacData],
          value, // Usa o valor diretamente para outros tipos de input
        },
      }));
    }
  };

  // Validação de CPF
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);

    setPacDataState((prevState) => ({
      ...prevState,
      pac_cpf: {
        ...prevState.pac_cpf,
        value: formattedCPF,
      },
    }));
  };

  const isInvalidCPF = useMemo(
    () => !isValidCPF(pacDataState.pac_cpf.value),
    [pacDataState.pac_cpf.value],
  );

  // Validação de telefone
  const isInvalidPhone = useMemo(
    () => !isValidPhone(pacDataState.pac_whatsapp.value),
    [pacDataState.pac_whatsapp.value],
  );

  // Validação de CEP
  const isZipCodeInvalid = useMemo(
    () => !isValidZipCode(pacDataState.pac_addrs_zip.value),
    [pacDataState.pac_addrs_zip.value],
  );

  // Validação de data de nascimento
  const handleDateChange = (value: DateValue | null) => {
    if (value) {
      setPacDataState((prevState) => ({
        ...prevState,
        pac_birth_date: {
          ...prevState.pac_birth_date,
          value: value.toString(), // Ou outro formato de data que você deseja usar
        },
      }));
    }
  };
  const missingFields = requiredFields.filter((field) => {
    // Se pac_addrs_comp deve ser preenchido apenas se pac_addrs_has_comp é verdadeiro
    if (field === "pac_addrs_comp") {
      return (
        pacDataState.pac_addrs_has_comp.value &&
        !pacDataState.pac_addrs_comp.value
      );
    }
  // eslint-disable-next-line prettier/prettier
  });

  // Função de submissão do formulário
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const preparedData = requiredFields.reduce(
      (acc, key) => {
        acc[key as keyof PacData] = pacDataState[key as keyof PacData].value; // Asserção de tipo

        return acc;
      },
      {} as Record<string, string | boolean>,
    );

    try {
      cadastroSchema.parse(preparedData);
      const { error } = await supabase.from("pacientes").insert([preparedData]);

      if (error) {
        console.error("Erro ao enviar dados ao Supabase:", error);
        throw error;
      }

      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce(
          (acc, e) => {
            acc[e.path[0]] = e.message;

            return acc;
          },
          {} as Record<string, string>,
        );

        setFormErrors(newErrors);
      } else if (error instanceof Error) {
        alert(`Erro ao enviar os dados: ${error.message}`);
        console.error("Erro:", error.message);
      } else {
        alert("Erro desconhecido, tente novamente.");
        console.error("Erro desconhecido:", error);
      }
    }
  };

  return {
    pacDataState,
    handleChange,
    setPacDataState,
    handleCPFChange,
    handleDateChange,
    isInvalidPhone,
    isInvalidCPF,
    formErrors,
    isZipCodeInvalid,
    submitHandler,
    missingFields,
  };
}
