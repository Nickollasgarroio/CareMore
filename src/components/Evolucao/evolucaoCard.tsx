import {
  Button,
  Divider,
  Input,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

import { CadastroModal } from "../CadastroModal";
import { ModalConfirmation } from "../modal_confirmation";

import { formatDate } from "@/utils/textUtils";
import { DeleteIcon, EditIcon, CheckIcon } from "@/assets/icon/Icons";
import { EvolucaoType } from "@/types/FormDataTypes";

export function EvolucaoCard({
  evolucao,
  onEdit,
  onDelete,
}: {
  evolucao: EvolucaoType;
  onEdit: (updatedEvolucao: EvolucaoType) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvolucao, setEditedEvolucao] = useState(evolucao);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para controle do modal de exclusão

  const handleChange = (field: keyof EvolucaoType, value: string) => {
    setEditedEvolucao((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    onEdit(editedEvolucao);
    onOpen(); // Abre o modal de sucesso ao salvar
  };

  const handleDelete = () => {
    if (evolucao.id) {
      onDelete(evolucao.id); // Only call onDelete if evolucao.id is defined
      setIsDeleteModalOpen(false); // Close the modal after deletion
    } else {
      console.error("Evolução ID is undefined");
    }
  };

  return (
    <div className="flex flex-col gap-4 ">
      <Divider />

      <Input
        color={!isEditing ? "default" : "warning"}
        label="Queixa"
        placeholder="Queixa"
        readOnly={!isEditing}
        value={editedEvolucao.queixa}
        onChange={(e) => handleChange("queixa", e.target.value)}
      />
      <Input
        readOnly
        color={!isEditing ? "default" : "warning"}
        label="Data"
        placeholder="Data"
        value={formatDate(editedEvolucao.date)}
      />
      <Textarea
        color={!isEditing ? "default" : "warning"}
        label="Observações"
        readOnly={!isEditing}
        value={editedEvolucao.observacao}
        onChange={(e) => handleChange("observacao", e.target.value)}
      />
      {/* Modal de Confirmação */}
      <CadastroModal
        isOpen={isOpen}
        message="Edição salva com sucesso!"
        status="success"
        onOpenChange={onOpenChange}
      />

      <Divider className="mt-2" />
      <div className="flex gap-4 mb-4">
        <div className="flex gap-4 mx-auto">
          {/* Botão de excluir com modal de confirmação */}
          <Button
            isIconOnly
            className="rounded-full"
            color="danger"
            onClick={() => setIsDeleteModalOpen(true)} // Abre o modal de confirmação
          >
            <DeleteIcon />
          </Button>
          {isEditing ? (
            <Button
              isIconOnly
              className="rounded-full"
              color="success"
              onPress={handleSave}
            >
              <CheckIcon />
            </Button>
          ) : (
            <Button
              isIconOnly
              className="rounded-full"
              color="primary"
              onPress={() => setIsEditing(true)}
            >
              <EditIcon />
            </Button>
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Deleção */}
      <ModalConfirmation
        cancelText="Cancelar"
        confirmColor="danger"
        confirmText="Sim, Excluir"
        description="Tem certeza de que deseja excluir esta evolução?"
        isOpen={isDeleteModalOpen}
        title="Confirmar Exclusão"
        onConfirm={handleDelete}
        onOpenChange={setIsDeleteModalOpen}
      />
    </div>
  );
}
