import { Spacer, Input, Button, useDisclosure } from "@nextui-org/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

// import { Link } from "react-router-dom"; // Remover se estiver usando NextUI Link
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate

import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";
import { UserSignInFormSchema } from "@/schemas/cadastroUserSchema";
import { UserLoginData } from "@/types/FormDataTypes";
import { CadastroModal } from "@/components/CadastroModal";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";

export default function UserLoginPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook de navegação
  const { session, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginData>({
    resolver: zodResolver(UserSignInFormSchema),
    mode: "onChange",
    defaultValues: {},
  });

  // Redireciona para /home se a sessão do usuário existir e não estiver carregando
  useEffect(() => {
    if (!loading && session) {
      navigate("/");
    }
  }, [loading, session, navigate]);

  const handleSignIn = async (data: UserLoginData) => {
    setError(null);
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error.message);
      setError(error.message);
      onOpen();
    } else {
      console.log("Logado com sucesso");
      onOpen(); // Abre o modal de sucesso
      setTimeout(() => {
        navigate("/"); // Redireciona após o sucesso do login
      }, 1500); // Espera 1.5 segundos para o usuário ver o modal antes do redirecionamento
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 ">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title({ color: "blue", size: "lg" })}>
            Seja Bem-vindo(a)!
          </h1>
          <h1 className={subtitle()}>Login</h1>
        </div>
      </section>
      <form onSubmit={handleSubmit(handleSignIn)}>
        <div className="flex flex-col gap-4 max-w-[400px] mx-auto">
          <Spacer />
          <Input
            isRequired
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            label="Email"
            labelPlacement="outside"
            placeholder="Email"
            type="email"
            {...register("email")}
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
          <Spacer />
          <div className="flex flex-row gap-4 mx-auto">
            <Link to={"/user/cadastro"}>
              <Button color="primary" variant="ghost">
                Cadastro
              </Button>
            </Link>

            <Button color="primary" type="submit">
              Login
            </Button>
          </div>
          <div className="flex flex-row gap-4 mx-auto">
            <p>Esqueceu sua senha?</p>

            <Link
              to={"/user/resetpassword"}
              className="transition duration-300 ease-in-out text-primary hover:cursor-pointer hover:underline hover:text-primary-400"
            >
              Redefinir Senha
            </Link>
          </div>
        </div>
        <CadastroModal
          error={error ? error : ""}
          isOpen={isOpen}
          message={
            error
              ? "Erro ao fazer o Login"
              : "Seu login foi realizado com sucesso!"
          }
          status={error ? "error" : "success"}
          onOpenChange={onOpenChange}
        />
      </form>
    </DefaultLayout>
  );
}
