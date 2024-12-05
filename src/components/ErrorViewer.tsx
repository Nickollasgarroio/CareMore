import React from "react";
import { FieldErrors } from "react-hook-form";

interface ErrorViewerProps {
  errors: FieldErrors;
}

export const ErrorViewer: React.FC<ErrorViewerProps> = ({ errors }) => {
  const errorEntries = Object.entries(errors);

  if (errorEntries.length === 0) {
    return <pre>Sem erros no formulário</pre>;
  }

  return (
    <pre>
      {JSON.stringify(
        errorEntries.map(([key, value]) => ({
          field: key,
          message: value?.message || "Erro desconhecido",
        })),
        null,
        2
      )}
    </pre>
  );
};
