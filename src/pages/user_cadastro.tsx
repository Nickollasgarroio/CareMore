import { Spacer, Input, Button, useDisclosure } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
// import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormMask } from "use-mask-input";
import { useState } from "react";

import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";
import { UserFormSchema } from "@/schemas/cadastroUserSchema";
import { UserSignUpFormData } from "@/types/FormDataTypes";
import { BgCard } from "@/components/bg-card";
import { CadastroModal } from "@/components/CadastroModal";
import { supabase } from "@/supabaseClient";

export default function UserCadastroPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); //declaração para uso do hook do modal
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm<UserSignUpFormData>({
    resolver: zodResolver(UserFormSchema),
    mode: "onChange",
    defaultValues: {
      role: "user",
    },
  });

  const registerWithMask = useHookFormMask(register);

  const onSubmit = () => {
    console.log(errors);
  };
  const handleSignUp = async (data: UserSignUpFormData) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log(error.message);
      setError(error.message);
    } else
      console.log(
        "Cadastro realizado com sucesso. Verifique seu email para confirmação!"
      );
    onOpen();
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
            <Link href="/user/login">
              <Button color="danger" variant="ghost">
                Login
              </Button>
            </Link>
            <Button color="primary" type="submit">
              Enviar
            </Button>
          </div>
          <CadastroModal
            isOpen={isOpen}
            status={error ? "error" : "success"}
            onOpenChange={onOpenChange}
            message={
              error
                ? `Houve um problema ao fazer o cadastro:`
                : "Cadastro realizado com sucesso!"
            }
            error={error ? error : ""}
          />
        </form>
      </div>
    </DefaultLayout>
  );
}
