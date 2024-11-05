import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Code,
} from "@nextui-org/react";

interface Props {
  status: "success" | "error";
  message?: string;
  isOpen: boolean;
  error?: string;
  onOpenChange: (open: boolean) => void;
}

export const CadastroModal: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  error,
  status = "error",
  message = "Erro Desconhecido, tente novamente mais tarde",
}) => {
  return (
    <>
      {/* <Button onPress={onOpen}>Teste</Button> */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader
                className={`flex flex-row gap-1 ${status === "success" ? "text-primary" : "text-danger"}`}
              >
                {status === "success" ? "Sucesso!" : "Erro"}
              </ModalHeader>
              <ModalBody>
                <p>{message}</p>
                {error && <Code className="text-wrap">{error}</Code>}{" "}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="bordered" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
