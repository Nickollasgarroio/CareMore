import { Spacer, Input, Button, useDisclosure } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
// import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";
import { UserSignInFormSchema } from "@/schemas/cadastroUserSchema";
import { UserLoginData } from "@/types/FormDataTypes";
import { CadastroModal } from "@/components/CadastroModal";
import { supabase } from "@/supabaseClient";

export default function UserLoginPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); //declaração para uso do hook do modal
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginData>({
    resolver: zodResolver(UserSignInFormSchema),
    mode: "onChange",
    defaultValues: {},
  });

  const onSubmit = () => {
    console.log(errors);
  };
  const handleSignIn = async (data: UserLoginData) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error.message);
      setError(error.message);
    } else console.log("Logado com sucesso");
    onOpen();
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 i md:py-10 ">
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
            <Link href={"/user/cadastro"}>
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
            <Link href={"/user/resetpassword"}>Redefinir Senha</Link>
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
