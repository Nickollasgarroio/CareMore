/* eslint-disable no-console */
import { Spacer, Input, Button, useDisclosure } from "@nextui-org/react";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate

import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";
import { CreateUserSchema } from "@/schemas/cadastroUserSchema";
import { UserSignUpFormData } from "@/types/FormDataTypes";
import { BgCard } from "@/components/bg-card";

import { supabase } from "@/supabaseClient";
import { GeneralModal } from "@/components/modals/GeneralModal";

export default function UserCadastroPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // useDisclosure para controlar o modal
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Inicia o hook de navegação

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
      onOpen(); // Abre o modal em caso de erro
      return;
    }

    // Verifique se o usuário foi criado e obtenha o ID
    const userId = signUpData.user?.id;

    if (!userId) {
      setError("Erro ao obter o ID do usuário.");
      onOpen(); // Abre o modal em caso de erro
      return;
    }

    // Se tudo der certo, exibe o modal de sucesso
    setError(null); // Limpa qualquer erro anterior
    onOpen(); // Abre o modal de sucesso

    // Redireciona o usuário para a página de home após o sucesso
    setTimeout(() => {
      navigate("/login"); // Redireciona para a página de home
    }, 1500); // Espera 1.5 segundos antes de redirecionar para dar tempo de exibir o modal
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
            <Link to="/login">
              <Button color="danger">Login</Button>
            </Link>
            <Button color="primary" type="submit">
              Continuar
            </Button>
          </div>
        </form>

        <GeneralModal isOpen={isOpen} onOpenChange={onOpenChange} />
      </div>
    </DefaultLayout>
  );
}
