import React from "react";
import { ConfirmationModal } from "./ConfirmationModal";
import { GeneralModal } from "./GeneralModal";
import { string } from "zod";

interface BaseProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ConfirmationModalProps extends BaseProps {
  type: "confirmation";
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
  confirmColor?: "primary" | "success" | "danger" | "default";
  onConfirm: () => void;
  navigateTo?: string;
}

interface GeneralModalProps extends BaseProps {
  type: "general";
  status?: "success" | "error";
  message?: string;
  error?: string;
  navigateTo?: string;
}

type Props = ConfirmationModalProps | GeneralModalProps;

/**
 * Componente principal que decide qual modal exibir.
 */
export const ModalManager: React.FC<Props> = (props) => {
  if (props.type === "confirmation") {
    return <ConfirmationModal {...props} />;
  }

  return <GeneralModal {...props} />;
};
