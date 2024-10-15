// useFormValidation.ts

import { useState } from "react";
import { cadastroSchema } from "@/schemas/formSchemas";
import { z } from "zod";
import { PacData } from "@/types/FormDataTypes"; // Altere o caminho conforme sua estrutura de pastas

export const useFormValidation = (pacDataState: PacData) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const preparedData = Object.keys(pacDataState).reduce((acc, key) => {
      acc[key as keyof PacData] = pacDataState[key as keyof PacData].value; 
      return acc;
    }, {} as Record<string, any>);

    try {
      cadastroSchema.parse(preparedData);
      setFormErrors({});
      return true; 
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, e) => {
          acc[e.path[0]] = e.message;
          return acc;
        }, {} as Record<string, string>);
        setFormErrors(newErrors);
      }
      return false; 
    }
  };

  return { formErrors, validate };
};
