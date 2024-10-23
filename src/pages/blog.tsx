import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { CadastroModal } from "@/components/CadastroModal";

export default function DocsPage() {
  // Controle de estado para abrir/fechar o modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <DefaultLayout>
      <Button onPress={onOpen}>Teste</Button>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Blog</h1>
        </div>
      </section>
      {/* <CadastroModal
        // error="Erro ao enviar dados ao Supabase"
        isOpen={isOpen}
        status="success"
        message="Seu cadastro foi realizado com sucesso!"
        onOpenChange={onOpenChange}
      /> */}
      <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
        <ModalContent>
          <ModalHeader>Modalaaaa</ModalHeader>
          <ModalBody>
            <p>Modal Body</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}
