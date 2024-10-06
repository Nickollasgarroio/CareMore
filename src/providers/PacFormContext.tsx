import React, { createContext, useContext } from "react";
import usePacFormState from "@/hooks/usePacData";

interface PacFormProviderProps {
  children: React.ReactNode;
}

// Definindo o tipo para o contexto
type PacFormContextType = ReturnType<typeof usePacFormState>;
const PacFormContext = createContext<PacFormContextType | null>(null);

export const PacFormProvider: React.FC<PacFormProviderProps> = ({ children }) => {
  const formState = usePacFormState(); // Isso já deve conter pacDataState e setPacDataState
  
  return (
    <PacFormContext.Provider value={formState}>
      {children}
    </PacFormContext.Provider>
  );
};

// Custom hook para acessar o contexto em qualquer componente
export const usePacForm = () => {
  const context = useContext(PacFormContext);

  if (!context) {
    throw new Error("usePacForm deve ser usado dentro de um PacFormProvider");
  }

  return context;
};
