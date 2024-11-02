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

export default function UserCadastroPage() {
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
      user_role: "user",
    },
  });

  const registerWithMask = useHookFormMask(register);

  const onSubmit = () => {
    console.log('Enviado com sucesso: ', getValues());
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
          onSubmit={handleSubmit(onSubmit)}
        >
          <Spacer />
          <BgCard className="flex flex-col gap-4 max-w-[400px]">
            <Input
              isRequired
              errorMessage={errors.user_name?.message}
              isInvalid={!!errors.user_name}
              label="Nome Completo"
              labelPlacement="outside"
              placeholder="Júlia Alves"
              {...register("user_name")}
            />
            <Input
              isRequired
              label="Telefone"
              labelPlacement="outside"
              placeholder="11 91234-5678"
              {...registerWithMask("user_phone", "99 99999-9999")}
            />
            <Select
              isRequired
              errorMessage={errors.user_especialidade?.message}
              isInvalid={!!errors.user_especialidade}
              label="Especialidade"
              labelPlacement="outside"
              placeholder="Fonoaudiologia"
              {...register("user_especialidade")}
            >
              {especialidades.map((especialidade) => (
                <SelectItem key={especialidade} value={especialidade}>
                  {especialidade}
                </SelectItem>
              ))}
            </Select>
          </BgCard>
          <BgCard className="flex flex-col gap-4 max-w-[400px]">
            <Input
              isRequired
              errorMessage={errors.user_email?.message}
              isInvalid={!!errors.user_email}
              label="Email"
              labelPlacement="outside"
              placeholder="julia@teste.com"
              type="email"
              {...register("user_email")}
            />
            <Input
              isRequired
              errorMessage={errors.user_email_confirmation?.message}
              isInvalid={!!errors.user_email_confirmation}
              label="Confirme Email"
              labelPlacement="outside"
              placeholder="julia@teste.com"
              type="email"
              {...register("user_email_confirmation")}
            />
            <Input
              isRequired
              errorMessage={errors.user_password?.message}
              isInvalid={!!errors.user_password}
              label="Senha"
              labelPlacement="outside"
              placeholder="Senha"
              type="password"
              {...register("user_password")}
            />
            <Input
              isRequired
              errorMessage={errors.user_password_confirmation?.message}
              isInvalid={!!errors.user_password_confirmation}
              label="Confirme a Senha"
              labelPlacement="outside"
              placeholder="Senha"
              type="password"
              {...register("user_password_confirmation")}
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
          <div className="flex flex-row gap-4 mx-auto">
            <p>Esqueceu sua senha?</p>
            <LinkNext>Redefinir Senha</LinkNext>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}

