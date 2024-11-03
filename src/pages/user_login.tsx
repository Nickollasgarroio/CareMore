import { Spacer, Input, Button, Select, SelectItem } from "@nextui-org/react";
import { Link as LinkNext } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormMask } from "use-mask-input";

import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";
import UserFormSchema from "@/schemas/cadastroUserSchema";
import { UserFormData } from "@/types/FormDataTypes";
import { BgCard } from "@/components/bg-card";

import { supabase } from "@/supabaseClient";
export default function UserLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm<UserFormData>({
    // resolver: zodResolver(UserFormSchema),
    mode: "onChange",
    defaultValues: {
      role: "user",
    },
  });

  const registerWithMask = useHookFormMask(register);

  const onSubmit = () => {
    console.log(errors);
  };
  const handleSignIn = async (data: UserFormData) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) console.log(error.message);
    else console.log("Logado com sucesso");
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
            label="Email"
            labelPlacement="outside"
            placeholder="Email"
            type="email"
            {...register("email")}
          />
          <Input
            isRequired
            label="Senha"
            labelPlacement="outside"
            placeholder="Senha"
            type="password"
            {...register("password")}
          />
          <Spacer />
          <div className="flex flex-row gap-4 mx-auto">
            <Link to={"/user/cadastro"}>
              <Button variant="ghost" color="primary">
                Cadastro
              </Button>
            </Link>
            <Button color="primary" type="submit">
              Login
            </Button>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          </div>
          <div className="flex flex-row gap-4 mx-auto">
            <p>Esqueceu sua senha?</p>
            <Link to={"/user/resetpassword"}>Redefinir Senha</Link>
          </div>
        </div>
      </form>
    </DefaultLayout>
  );
}
