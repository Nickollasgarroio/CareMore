import { Spacer, Input, Button, useDisclosure } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { AuthError } from "@supabase/supabase-js";
import { supabase } from "@/supabaseClient";
import DefaultLayout from "@/layouts/default";
import { UserResetPasswordSchema } from "@/schemas/cadastroUserSchema";
import { UserResetPasswordData } from "@/types/FormDataTypes";
import { BgCard } from "@/components/bg-card";
import { BackButton } from "@/components/BackButton";
import { ModalManager } from "@/components/modals/ModalManager";
import { ErrorViewer } from "@/components/ErrorViewer";

export default function UserUpdatePasswordPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<AuthError | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserResetPasswordData>({
    resolver: zodResolver(UserResetPasswordSchema),
    mode: "onChange",
  });

  const handleUpdate = async (data: UserResetPasswordData) => {
    const { password } = data;
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error);
    } else {
      onOpen();
    }
  };

  return (
    <DefaultLayout>
      <section>
        <BackButton subtitulo="Atualizar Senha" titulo="Login" />
      </section>
      <form
        className="flex flex-col gap-4 max-w-[400px] mx-auto"
        onSubmit={handleSubmit(handleUpdate)}
      >
        <p>Insira sua nova senha!</p>
        <BgCard className="flex flex-col gap-4 max-w-[400px]">
          <Input
            isRequired
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            label="Nova Senha"
            labelPlacement="outside"
            type="password"
            {...register("password")}
          />
        </BgCard>
        <Spacer />
        <div className="flex flex-row gap-4 mx-auto">
          <Button color="danger" variant="bordered">
            Voltar
          </Button>
          <Button color="primary" type="submit">
            Atualizar
          </Button>
        </div>
        <ModalManager
          status={error ? "error" : "success"}
          error={error?.message}
          isOpen={isOpen}
          message="Senha atualizada com sucesso!"
          type="general"
          onOpenChange={onOpenChange}
        />
        <ErrorViewer errors={errors} />
      </form>
    </DefaultLayout>
  );
}
