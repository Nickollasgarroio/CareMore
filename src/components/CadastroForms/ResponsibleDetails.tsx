/* eslint-disable prettier/prettier */
import { Checkbox } from "@nextui-org/react";

import InputField from "@/components/CadastroForms/InputField";
import usePacFormState from "@/hooks/usePacData";
import usePacForm from "@/hooks/usePacData";

export const ResponsibleDetails = () => {
  const { pacDataState, setPacDataState } = usePacForm();
  const {
    handleChange,
    isInvalidPhone,
  } = usePacFormState();

  return (
    <>
      <div className="flex flex-col gap-4">
        <Checkbox
          className=""
          defaultSelected={true}
          size="sm"
          onChange={() =>
            setPacDataState((prevData) => ({
              ...prevData,
              pac_has_resp: {
                ...prevData.pac_has_resp,
                value: !prevData.pac_has_resp.value, // Alterna o valor do campo pac_has_resp
              },
            }))
          }
        >
          Paciente possui responsável
        </Checkbox>

        {/* Nome do Responsável */}
        <InputField
          isRequired={pacDataState.pac_has_resp.value}
          label="Nome do Responsável"
          labelPlacement="outside"
          name="pac_resp_name"
          placeholder="Nome do Responsável"
          value={pacDataState.pac_resp_name.value}
          onChange={handleChange} // Passa handleChange para atualizar o estado
        />

        {/* Ocupação do Responsável */}
        <InputField
          isRequired={pacDataState.pac_has_resp.value}
          label="Ocupação"
          labelPlacement="outside"
          name="pac_resp_ocupation"
          placeholder="Ex: Arquiteto"
          value={pacDataState.pac_resp_ocupation.value}
          onChange={handleChange}
        />

        {/* Email do Responsável */}
        <InputField
          isRequired={pacDataState.pac_has_resp.value}
          label="Email"
          labelPlacement="outside"
          name="pac_resp_email"
          placeholder="Email do Responsável"
          type="email"
          value={pacDataState.pac_resp_email.value}
          onChange={handleChange}
        />

        {/* WhatsApp do Responsável */}
        <InputField
          errorMessage={isInvalidPhone ? "Número de telefone inválido" : ""}
          isInvalid={Boolean(isInvalidPhone)}
          isRequired={pacDataState.pac_has_resp.value}
          label="WhatsApp do Responsável"
          labelPlacement="outside"
          maxLength={11}
          name="pac_resp_whatsapp"
          placeholder="+55 (XX) XXXXX-XXXX"
          value={pacDataState.pac_resp_whatsapp.value}
          onChange={handleChange}
        />

        {/* Escolaridade do Responsável */}
        <InputField
          isRequired={pacDataState.pac_has_resp.value}
          label="Escolaridade"
          labelPlacement="outside"
          name="pac_resp_education"
          placeholder="Ex: Ensino Superior"
          value={pacDataState.pac_resp_education.value}
          onChange={handleChange}
        />
      </div>
    </>
  );
};
