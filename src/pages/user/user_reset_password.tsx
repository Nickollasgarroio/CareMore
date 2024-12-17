import { Spacer, Input, Button, useDisclosure } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { AuthError } from "@supabase/supabase-js";

import { supabase } from "@/supabaseClient";
import DefaultLayout from "@/layouts/default";
import { UserResetPasswordSchema } from "@/schemas/cadastroUserSchema";
import { UserResetPasswordData } from "@/types/FormDataTypes";
import { ModalManager } from "@/components/modals/ModalManager";
import { BackButton } from "@/components/BackButton";

export default function UserResetPasswordPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserResetPasswordData>({
    resolver: zodResolver(UserResetPasswordSchema),
    mode: "onChange",
  });

  const handleReset = async (data: UserResetPasswordData) => {
    setIsLoading(true);
    const { email } = data;

    if (!email) {
      setError({ message: "O campo de e-mail é obrigatório." } as AuthError);
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/#/user/update-password", // Redirecionamento para a página de atualização
    });
    setIsLoading(false);

    if (error) {
      setError(error);
    } else {
      onOpen();
    }
  };

  return (
    <DefaultLayout>
      <section>
        <BackButton subtitulo="Redefinir Senha" titulo="Login" />
      </section>
      <form
        className="flex flex-col gap-4 max-w-[400px] mx-auto"
        onSubmit={handleSubmit(handleReset)}
      >
        <p>Insira o email cadastrado para redefinir sua senha!</p>
        <Input
          isRequired
          errorMessage={errors.email?.message}
          isInvalid={!!errors.email}
          label="Email"
          labelPlacement="outside"
          placeholder="julia@teste.com"
          type="email"
          {...register("email")}
        />
        <Spacer />
        <div className="flex flex-row gap-4 mx-auto">
          <Link to="/login">
            <Button color="danger" variant="bordered">
              Voltar
            </Button>
          </Link>
          <Button color="primary" type="submit" isDisabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
        <ModalManager
          error={error?.message}
          isOpen={isOpen}
          message="Verifique seu email para redefinir sua senha!"
          status={error ? "error" : "success"}
          type="general"
          onOpenChange={onOpenChange}
        />
      </form>
    </DefaultLayout>
  );
}
