import { Button, Spinner } from "@nextui-org/react";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export function LoadingSpinner() {
  // Controle de estado para abrir/fechar o modal

  return (
    <div className="flex flex-col h-screen">
      <Spinner className="mx-auto my-auto" />
    </div>
  );
}
