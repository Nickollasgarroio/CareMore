import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Code,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

interface GeneralModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  status?: "success" | "error";
  message?: string | null;
  error?: string;
  navigateTo?: string;
}

/**
 * Modal usado para exibir mensagens gerais, como erros ou sucessos.
 */
export const GeneralModal: React.FC<GeneralModalProps> = ({
  isOpen,
  onOpenChange,
  status = "error",
  message = "Erro Desconhecido, tente novamente mais tarde",
  error,
  navigateTo,
}) => {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader
              className={`flex flex-row gap-1 ${
                status === "success" ? "text-primary" : "text-danger"
              }`}
            >
              {status === "success" ? "Sucesso!" : "Erro"}
            </ModalHeader>
            <ModalBody>
              <p>{message}</p>
              {error && <Code className="text-wrap">{error}</Code>}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="bordered"
                onPress={navigateTo ? () => navigate(`${navigateTo}`) : onClose}
              >
                Fechar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
