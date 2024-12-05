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
import { BgCard } from "@/components/bg-card";
import { BackButton } from "@/components/BackButton";
import { ModalManager } from "@/components/modals/ModalManager";
import { ErrorViewer } from "@/components/ErrorViewer";

export default function UserResetPasswordPage() {
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

  const handleReset = async (data: UserResetPasswordData) => {
    const { email } = data;
    setError(null); // Reset previous error state before attempting to send the request.
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setError(error); // Set error if any occurs.
    } else {
      onOpen(); // Open success modal when the email is successfully sent.
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
        <BgCard className="flex flex-col gap-4 max-w-[400px]">
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
        </BgCard>
        <Spacer />
        <div className="flex flex-row gap-4 mx-auto">
          <Link to="/login">
            <Button color="danger" variant="bordered">
              Voltar
            </Button>
          </Link>
          <Button color="primary" type="submit">
            Enviar
          </Button>
        </div>
        <ModalManager
          status={error ? "error" : "success"}
          error={error?.message}
          isOpen={isOpen}
          message="Verifique seu email para redefinir sua senha!"
          type="general"
          onOpenChange={onOpenChange}
        />
        {/* <ErrorViewer errors={errors} /> */}
      </form>
    </DefaultLayout>
  );
}
