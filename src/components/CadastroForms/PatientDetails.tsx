import React, { useState } from "react";
import { Spacer, Checkbox, Button } from "@nextui-org/react";

import InputField from "@/components/CadastroForms/InputField";
import SelectField from "@/components/CadastroForms/SelectField";
import DatePicker from "@/components/CadastroForms/DatePicker";
import { usePacForm } from "@/providers/PacFormContext"; // Usando o hook customizado

export const PatientDetails = () => {
  const [showTeste, setShowTeste] = useState(false);

  const {
    pacDataState,
    handleChange,
    setPacDataState,
    handleCPFChange,
    handleDateChange,
    isInvalidPhone,
    isInvalidCPF,
    formErrors,
    isZipCodeInvalid,
  } = usePacForm(); // Acessa o contexto corretamente

  return (
    <>
      <div>
        <div className="flex flex-col gap-4">
          <InputField
            errorMessage={formErrors.pac_name}
            isInvalid={Boolean(formErrors.pac_name)}
            isRequired={pacDataState.pac_name.required}
            label="Nome Completo"
            labelPlacement="outside"
            name="pac_name"
            placeholder="Nome do Paciente"
            value={pacDataState.pac_name.value}
            onChange={handleChange}
          />

          <SelectField
            errorMessage={formErrors.pac_sex}
            isInvalid={Boolean(formErrors.pac_sex)}
            isRequired={pacDataState.pac_sex.required}
            label="Sexo"
            labelPlacement="outside"
            name="pac_sex"
            options={[
              { label: "Masculino", value: "Masculino" },
              { label: "Feminino", value: "Feminino" },
              { label: "Não Binário", value: "Não Binário" },
            ]}
            placeholder="Masculino"
            value={pacDataState.pac_sex.value}
            onChange={handleChange}
          />

          <InputField
            errorMessage={isInvalidPhone ? "Número de telefone inválido" : ""}
            isInvalid={Boolean(isInvalidPhone)}
            isRequired={pacDataState.pac_whatsapp.required}
            label="Telefone"
            labelPlacement="outside"
            mask="+55 (99) 99999-9999"
            name="pac_whatsapp"
            placeholder="Telefone"
            value={pacDataState.pac_whatsapp.value}
            onChange={handleChange}
          />

          <InputField
            className="w-full"
            color="default"
            errorMessage="Email inválido"
            isRequired={pacDataState.pac_email.required}
            label="Email"
            labelPlacement="outside"
            name="pac_email"
            placeholder="E-mail do Paciente"
            type="email"
            value={pacDataState.pac_email.value}
            onChange={handleChange}
          />

          <InputField
            errorMessage={isInvalidCPF ? "CPF inválido" : ""}
            isInvalid={isInvalidCPF}
            isRequired={pacDataState.pac_cpf.required}
            label="CPF"
            labelPlacement="outside"
            mask="999.999.999-99"
            name="pac_cpf"
            placeholder="CPF"
            value={pacDataState.pac_cpf.value}
            onChange={handleCPFChange}
          />

          <DatePicker
            isRequired={pacDataState.pac_birth_date.required}
            label="Data de Nascimento"
            labelPlacement="outside"
            name="pac_birth_date"
            showMonthAndYearPickers={true}
            onChange={handleDateChange}
          />
        </div>

        <Spacer />

        <div className="flex flex-col gap-4 mt-4">
          <InputField
            errorMessage={isZipCodeInvalid ? "CEP inválido" : ""}
            isInvalid={isZipCodeInvalid}
            isRequired={pacDataState.pac_addrs_zip.required}
            label="CEP"
            labelPlacement="outside"
            mask="99999-999"
            name="pac_addrs_zip"
            placeholder="CEP"
            value={pacDataState.pac_addrs_zip.value}
            onChange={handleChange}
          />

          <div className="flex flex-row gap-4">
            <InputField
              className="w-3/4"
              isRequired={pacDataState.pac_addrs_street_name.required}
              label="Endereço"
              labelPlacement="outside"
              name="pac_addrs_street_name"
              placeholder="Av. Paulista"
              value={pacDataState.pac_addrs_street_name.value}
              onChange={handleChange}
            />

            <InputField
              className="w-1/4"
              isRequired={pacDataState.pac_addrs_num.required}
              label="Número"
              labelPlacement="outside"
              name="pac_addrs_num"
              placeholder="1500"
              value={pacDataState.pac_addrs_num.value}
              onChange={handleChange}
            />
          </div>

          <InputField
            className="w-full"
            isRequired={!!pacDataState.pac_addrs_has_comp.value}
            label="Complemento"
            labelPlacement="outside"
            name="pac_addrs_comp"
            placeholder="Terceiro Andar"
            value={pacDataState.pac_addrs_comp.value}
            onChange={handleChange}
          />

          <Checkbox
            defaultSelected={false}
            size="sm"
            onChange={() =>
              setPacDataState((prevData) => ({
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

        <div className="flex flex-col gap-4 mt-6">
          <Button onClick={() => setShowTeste(!showTeste)}>
            Mostrar Detalhes de Teste
          </Button>
          <div className={showTeste ? "" : "hidden"}>
            {/* Detalhes adicionais aqui */}
          </div>
        </div>
      </div>
    </>
  );
};
