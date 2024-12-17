import {
  Spacer,
  Input,
  Button,
  useDisclosure,
  Card,
  CardBody,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthError } from "@supabase/supabase-js";

import { supabase } from "@/supabaseClient";
import DefaultLayout from "@/layouts/default";
import { UserResetPasswordSchema } from "@/schemas/cadastroUserSchema";
import { UserResetPasswordData } from "@/types/FormDataTypes";
import { ModalManager } from "@/components/modals/ModalManager";
import { BackButton } from "@/components/BackButton";

export default function UserUpdatePasswordPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Para pegar os parâmetros da URL

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserResetPasswordData>({
    resolver: zodResolver(UserResetPasswordSchema),
    mode: "onChange",
  });

  // Pegar o parâmetro `token` da URL (o token é passado no magic link)
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // Tenta autenticar automaticamente com o token recebido
      const setSessionData = async () => {
        const { error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: token, // Caso o refresh token também venha junto, use-o aqui
        });

        if (error) {
          console.error("Erro ao configurar sessão:", error.message);
        } else {
          console.log("Sessão configurada com sucesso!");
        }
      };

      setSessionData();
    }
  }, [token]);

  const handleUpdate = async (data: UserResetPasswordData) => {
    setIsLoading(true);

    try {
      const { password } = data;

      // Atualiza a senha do usuário
      const { error } = await supabase.auth.updateUser({ password });

      setIsLoading(false);

      if (error) {
        setError(error);
        return;
      }

      onOpen();
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Erro inesperado:", err);
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <section>
        <BackButton subtitulo="Atualizar Senha" titulo="Login" />
      </section>
      <form
        className="flex flex-col gap-4 max-w-[400px] mx-auto"
        onSubmit={handleSubmit(handleUpdate)}
      >
        <Card>
          <CardBody className="flex flex-col gap-4 p-6">
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
              description="Insira aqui sua nova senha"
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
              label="Nova Senha"
              labelPlacement="outside"
              placeholder="senhasupersegura123"
              type="password"
              {...register("password")}
            />
          </CardBody>
        </Card>
        <Spacer />
        <div className="flex flex-row gap-4 mx-auto">
          <Button
            color="danger"
            variant="bordered"
            onClick={() => navigate("/login")}
          >
            Voltar
          </Button>
          <Button color="primary" isDisabled={isLoading} type="submit">
            {isLoading ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
        <ModalManager
          error={error?.message}
          isOpen={isOpen}
          message="Senha atualizada com sucesso!"
          status={error ? "error" : "success"}
          type="general"
          onOpenChange={onOpenChange}
        />
      </form>
    </DefaultLayout>
  );
}
