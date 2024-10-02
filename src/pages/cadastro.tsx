import { useState, useMemo } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  DatePicker,
  Spacer,
  Checkbox,
} from "@nextui-org/react";
import { getLocalTimeZone, DateValue, today } from "@internationalized/date";

import DefaultLayout from "@/layouts/default";
import { formatCPF, isValidCPF } from "@/utils/cpfUtils";
import { formatPhone, isValidPhone } from "@/utils/phoneUtils";
import { formatZipCode, isValidZipCode } from "@/utils/zipUtils";
import { BgCard } from "@/components/bg-card";
import { supabase } from "@/supabaseClient"; // Importe o cliente Supabase

export default function CadastroPage() {
  const [pacData, setPacData] = useState({
    pac_name: { value: "", required: true },
    pac_sex: { value: "Masculino", required: true },
    pac_whatsapp: { value: "", required: true },
    pac_cpf: { value: "", required: true },
    pac_birth_date: { value: "", required: true },
    pac_addrs_street_name: { value: "", required: true },
    pac_addrs_num: { value: "", required: true },
    pac_addrs_zip: { value: "", required: true },
    pac_addrs_has_comp: { value: true, required: true },
    pac_addrs_comp: { value: "", required: true },
    pac_has_resp: { value: true, required: true },
    pac_resp_name: { value: "", required: true },
    pac_resp_email: { value: "", required: true },
    pac_resp_whatsapp: { value: "", required: true },
    pac_resp_education: { value: "", required: true },
    pac_resp_ocupation: { value: "", required: true },
  });

  const [isZipCodeInvalid, setIsZipCodeInvalid] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "pac_addrs_zip") {
      const formattedZip = formatZipCode(value);
      setIsZipCodeInvalid(!isValidZipCode(formattedZip));
    }

    setPacData((prevData) => ({
      ...prevData,
      [name]:
        name === "pac_cpf"
          ? formatCPF(value)
          : name === "pac_whatsapp" || name === "pac_resp_whatsapp"
            ? formatPhone(value)
            : name === "pac_addrs_zip"
              ? formatZipCode(value)
              : value,
    }));
  };

  const handleDateChange = (value: DateValue | null) => {
    if (value) {
      setPacData((prevData) => ({
        ...prevData,
        pac_birth_date: {
          ...prevData.pac_birth_date, // Retain required and other properties
          value: value.toString(), // Update the value property
        },
      }));
    }
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setPacData((prevData) => ({
      ...prevData,
      pac_whatsapp: {
        ...prevData.pac_whatsapp,
        value: formatPhone(value), // Formata o telefone enquanto preserva o input
      },
    }));
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setPacData((prevData) => ({
      ...prevData,
      pac_cpf: {
        ...prevData.pac_cpf,
        value, // Apenas atualiza o valor sem sobrescrever outras propriedades
      },
    }));
  };

  const checkIfDataIsNotEmpty = () => {
    for (const [key, value] of Object.entries(pacData)) {
      if (value.value === "") {
        alert("Todos os campos devem ser preenchidos");
        return false;
      }
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidCPF(pacData.pac_cpf.value)) {
      alert("CPF inválido!");
      return;
    }
    if (isZipCodeInvalid) {
      alert("CEP inválido!");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("pacientes")
        .insert([pacData]);

      if (error) throw error;

      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        alert("Erro ao enviar os dados, tente novamente.");
      } else {
        alert("Erro desconhecido, tente novamente.");
      }
    }
  };

  const isInvalidPhone = useMemo(() => {
    const { pac_whatsapp, pac_resp_whatsapp } = pacData;

    return (
      (pac_whatsapp.value && !isValidPhone(pac_whatsapp.value)) ||
      (pac_resp_whatsapp.value && !isValidPhone(pac_resp_whatsapp.value))
    );
  }, [pacData.pac_whatsapp.value, pacData.pac_resp_whatsapp.value]);

  const isInvalidCPF = useMemo(() => {
    return pacData.pac_cpf.value ? !isValidCPF(pacData.pac_cpf.value) : false;
  }, [pacData.pac_cpf.value]);

  return (
    <DefaultLayout>
      <div>
        <title>Cadastro</title>
        <form
          className="flex flex-col gap-4 max-w-[450px] mx-auto"
          onSubmit={handleSubmit}
        >
          <BgCard>
            <div className="flex flex-col gap-4">
              <Input
                isRequired={pacData.pac_name.required}
                label="Nome Completo"
                labelPlacement="outside"
                name="pac_name"
                placeholder="Nome do Paciente"
                value={pacData.pac_name.value}
                onChange={handleChange}
              />
              <Select
                isRequired={pacData.pac_sex.required}
                label="Sexo"
                labelPlacement="outside"
                name="pac_sex"
                placeholder={pacData.pac_sex.value}
                value={pacData.pac_sex.value}
                onChange={handleChange}
              >
                <SelectItem key="masculino" value="Masculino">
                  Masculino
                </SelectItem>
                <SelectItem key="feminino" value="Feminino">
                  Feminino
                </SelectItem>
                <SelectItem key="nao_binario" value="Não Binário">
                  Não Binário
                </SelectItem>
              </Select>
              <Input
                isRequired={pacData.pac_whatsapp.required}
                errorMessage={
                  isInvalidPhone ? "Número de telefone inválido" : ""
                }
                isInvalid={Boolean(isInvalidPhone)}
                label="WhatsApp"
                labelPlacement="outside"
                name="pac_whatsapp"
                placeholder="+55 (XX) XXXXX-XXXX"
                value={pacData.pac_whatsapp.value}
                onChange={handlePhoneChange}
              />
              <Input
                isRequired={pacData.pac_cpf.required}
                errorMessage={isInvalidCPF ? "CPF inválido" : ""}
                isInvalid={isInvalidCPF}
                label="CPF"
                labelPlacement="outside"
                name="pac_cpf"
                placeholder="000.000.000-00"
                value={pacData.pac_cpf.value}
                onChange={handleCPFChange}
              />
              <DatePicker
                isRequired={pacData.pac_birth_date.required}
                showMonthAndYearPickers
                label="Data de Nascimento"
                labelPlacement="outside"
                maxValue={today(getLocalTimeZone())}
                name="pac_birth_date"
                onChange={handleDateChange}
              />
            </div>

            <Spacer />
            <div className="flex flex-col gap-4 mt-4">
              <Input
                isRequired={pacData.pac_addrs_zip.required}
                className="w-full"
                color={isZipCodeInvalid ? "danger" : "default"}
                errorMessage={isZipCodeInvalid ? "CEP inválido" : ""}
                isInvalid={isZipCodeInvalid}
                label="CEP"
                labelPlacement="outside"
                name="pac_addrs_zip"
                placeholder="00000-000"
                value={pacData.pac_addrs_zip.value}
                onChange={handleChange}
              />

              <div className="flex flex-row gap-4">
                <Input
                  isRequired={pacData.pac_addrs_street_name.required}
                  className="w-3/4"
                  label="Endereço"
                  labelPlacement="outside"
                  name="pac_addrs_street_name"
                  placeholder="Av. Paulista"
                  value={pacData.pac_addrs_street_name.value}
                  onChange={handleChange}
                />

                <Input
                  isRequired={pacData.pac_addrs_num.required}
                  className="w-1/4"
                  label="Número"
                  labelPlacement="outside"
                  name="pac_addrs_num"
                  placeholder="1500"
                  value={pacData.pac_addrs_num.value}
                  onChange={handleChange}
                />
              </div>

              <Input
                className="w-full"
                isRequired={pacData.pac_addrs_has_comp.value}
                label="Complemento"
                labelPlacement="outside"
                name="pac_addrs_comp"
                placeholder="Terceiro Andar"
                value={pacData.pac_addrs_comp.value}
                onChange={handleChange}
              />
              <Checkbox
                className=""
                defaultSelected={false}
                size="sm"
                onChange={() =>
                  setPacData((prevData) => ({
                    ...prevData,
                    pac_addrs_has_comp: {
                      ...prevData.pac_addrs_has_comp,
                      value: !prevData.pac_addrs_has_comp.value,
                    },
                  }))
                }
              >
                Endereço não possui complemento
              </Checkbox>
            </div>
          </BgCard>
          <BgCard>
            <Spacer />
            <div className="flex flex-col gap-4">
              <Checkbox
                className=""
                defaultSelected={true}
                size="sm"
                onChange={() =>
                  setPacData((prevData) => ({
                    ...prevData,
                    pac_has_resp: {
                      ...prevData.pac_has_resp,
                      value: !prevData.pac_has_resp.value,
                    },
                  }))
                }
              >
                Paciente possui responsável
              </Checkbox>

              <Input
                isRequired={pacData.pac_has_resp.value}
                label="Nome do Responsável"
                labelPlacement="outside"
                name="pac_resp_name"
                placeholder="Nome do Responsável"
                value={pacData.pac_resp_name.value}
                onChange={handleChange}
              />
              <Input
                isRequired={pacData.pac_has_resp.value}
                label="Ocupação"
                labelPlacement="outside"
                name="pac_resp_ocupation"
                placeholder="Ex: Arquiteto"
                value={pacData.pac_resp_ocupation.value}
                onChange={handleChange}
              />
              <Input
                isRequired={pacData.pac_has_resp.value}
                label="Email"
                labelPlacement="outside"
                name="pac_resp_email"
                placeholder="Email do Responsável"
                value={pacData.pac_resp_email.value}
                onChange={handleChange}
              />
              <Input
                isRequired={pacData.pac_has_resp.value}
                errorMessage={
                  isInvalidPhone ? "Número de telefone inválido" : ""
                }
                isInvalid={Boolean(isInvalidPhone)}
                label="WhatsApp do Responsável"
                labelPlacement="outside"
                name="pac_resp_whatsapp"
                placeholder="+55 (XX) XXXXX-XXXX"
                value={pacData.pac_resp_whatsapp.value}
                onChange={handleChange}
              />
              <Input
                isRequired={pacData.pac_has_resp.value}
                label="Escolaridade"
                labelPlacement="outside"
                name="pac_resp_education"
                placeholder="Ex: Ensino Superior"
                value={pacData.pac_resp_education.value}
                onChange={handleChange}
              />
            </div>
          </BgCard>
          <Spacer />
          <div className="flex">
            <Button className="mx-auto" color="primary" type="submit">
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}
