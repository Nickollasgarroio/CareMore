/* eslint-disable prettier/prettier */
import { useState } from "react";
import { Button, Spacer } from "@nextui-org/react";

import DefaultLayout from "@/layouts/default";
import { BgCard } from "@/components/bg-card";
import usePacFormState from "@/hooks/usePacData";
import  {PatientDetails}  from "@/components/CadastroForms/PatientDetails";
import { ResponsibleDetails } from "@/components/CadastroForms/ResponsibleDetails";
import { PacFormProvider } from "@/providers/PacFormContext";

export default function CadastroPage() {
  
  const {
    pacDataState,
    handleSubmit,
    missingFields,
  } = usePacFormState();

  return (
    <PacFormProvider>
    <DefaultLayout>
      <div>
        <form
          className="flex flex-col gap-4 max-w-[450px] mx-auto"
          title="Cadastro de Paciente"
          onSubmit={handleSubmit}
        >
          <BgCard>
            <PatientDetails />
          </BgCard>
          <Spacer />
          <BgCard>
           <ResponsibleDetails/>
          </BgCard>
          <Spacer />

          <div className="flex">
            <Button
              className="mx-auto"
              color="primary"
              // isDisabled={missingFields.length > 0 ? true : false} // Desabilita se houver campos obrigatórios vazios
              type="submit"
            >
              Enviar
            </Button>
          </div>
        </form>
        <div>
          <pre>{JSON.stringify(pacDataState, null, 2)}</pre>
          MISSING:{missingFields.length}
        </div>
      </div>
    </DefaultLayout>
    </PacFormProvider>
  );
}
