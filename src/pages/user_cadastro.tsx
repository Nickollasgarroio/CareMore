/* eslint-disable no-console */
import { Spacer, Input, Button, useDisclosure } from "@nextui-org/react";
import { Link } from "@nextui-org/react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";
import { CreateUserSchema } from "@/schemas/cadastroUserSchema";
import { UserSignUpFormData } from "@/types/FormDataTypes";
import { BgCard } from "@/components/bg-card";
import { CadastroModal } from "@/components/CadastroModal";
import { supabase } from "@/supabaseClient";

export default function UserCadastroPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSignUpFormData>({
    resolver: zodResolver(CreateUserSchema),
    mode: "onChange",
    defaultValues: {
      role: "user",
    },
  });

  const handleSignUp = async (data: UserSignUpFormData) => {
    const { email, password } = data;

    // Primeiro, crie o usuário no Supabase Auth
    const { error: signUpError, data: signUpData } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );

    if (signUpError) {
      console.log(signUpError.message);
      setError(signUpError.message);
      onOpen();

      return;
    }

    // Verifique se o usuário foi criado e obtenha o ID
    const userId = signUpData.user?.id;

    if (!userId) {
      setError("Erro ao obter o ID do usuário.");
      onOpen();

      return;
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title({ color: "blue", size: "lg" })}>
            Seja Bem-vindo(a)!
          </h1>
          <h1 className={subtitle()}>Cadastro</h1>
        </div>
      </section>
      <div>
        <form
          className="flex flex-col gap-4 max-w-[400px] mx-auto"
          onSubmit={handleSubmit(handleSignUp)}
        >
          <Spacer />
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
            <Input
              isRequired
              errorMessage={errors.email_confirmation?.message}
              isInvalid={!!errors.email_confirmation}
              label="Confirme Email"
              labelPlacement="outside"
              placeholder="julia@teste.com"
              type="email"
              {...register("email_confirmation")}
            />
            <Input
              isRequired
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
              label="Senha"
              labelPlacement="outside"
              placeholder="Senha"
              type="password"
              {...register("password")}
            />
            <Input
              isRequired
              errorMessage={errors.password_confirmation?.message}
              isInvalid={!!errors.password_confirmation}
              label="Confirme a Senha"
              labelPlacement="outside"
              placeholder="Senha"
              type="password"
              {...register("password_confirmation")}
            />
          </BgCard>
          <Spacer />
          <div className="flex flex-row gap-4 mx-auto">
            <Link href="/login">
              <Button color="danger">Login</Button>
            </Link>
            <Button
              color="primary"
              type="submit" // Envolvemos `handleSubmit` em uma função anônima
            >
              Continuar
            </Button>
          </div>
        </form>

        <CadastroModal
          error={error ? error : ""}
          isOpen={isOpen}
          message={
            error
              ? `Houve um problema ao fazer o cadastro:`
              : "Cadastro realizado com sucesso!"
          }
          status={error ? "error" : "success"}
          onOpenChange={onOpenChange}
        />
        {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
      </div>
    </DefaultLayout>
  );
}
