import { Spacer, Input, Button, Select, SelectItem } from "@nextui-org/react";
import { Link as LinkNext } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormMask } from "use-mask-input";

import { especialidades } from "./configs/cadastroConfigs";

import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";
import UserFormSchema from "@/schemas/cadastroUserSchema";
import { UserFormData } from "@/types/FormDataTypes";
import { BgCard } from "@/components/bg-card";

export default function UserResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
    mode: "onChange",
    defaultValues: {
      role: "user",
    },
  });

  const registerWithMask = useHookFormMask(register);

  const onSubmit = () => {
    console.log("Enviado com sucesso: ", getValues());
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title({ color: "blue", size: "lg" })}>
            Seja Bem-vindo(a)!
          </h1>
          <h1 className={subtitle()}>Redefinir Senha</h1>
        </div>
      </section>
      <div>
        <form
          className="flex flex-col gap-4 max-w-[400px] mx-auto"
          onSubmit={handleSubmit(onSubmit)}
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
            <Link to="/user/login">
              <Button color="danger" variant="ghost">
                Login
              </Button>
            </Link>
            <Button color="primary" type="submit">
              Enviar
            </Button>
          </div>
          <div className="flex flex-row gap-4 mx-auto"></div>
        </form>
      </div>
    </DefaultLayout>
  );
}
