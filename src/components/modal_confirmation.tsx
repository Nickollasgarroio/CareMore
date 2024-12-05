import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

interface ModalConfirmationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void; // Ação a ser executada ao confirmar
  confirmText?: string; // Texto do botão de confirmação
  cancelText?: string; // Texto do botão de cancelamento
  confirmColor?: "primary" | "danger" | "success" | "default"; // Cor do botão de confirmação
}

export const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "primary",
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <p>{description}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="bordered"
                onPress={() => onOpenChange(false)}
              >
                {cancelText}
              </Button>
              <Button
                color={confirmColor}
                onPress={() => {
                  onConfirm();
                  onOpenChange(false);
                }}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
