import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

interface Props {
  status: "success" | "error";
  message?: string;
  error?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CadastroModal: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  status = "error",
  message,
  error = "Erro Desconhecido, tente novamente mais tarde",
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
                {/* <Chip
                  className="mx-2"
                  color={status === "success" ? "success" : "danger"}
                /> */}
                {status === "success" ? "Sucesso!" : "Erro"}
              </ModalHeader>
              <ModalBody>
                <p>{status === "success" ? message : error}</p>
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
