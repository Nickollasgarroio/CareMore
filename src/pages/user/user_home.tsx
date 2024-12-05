/* eslint-disable @typescript-eslint/no-unused-vars */

import { Card, CardBody, CardHeader, Button, Link } from "@nextui-org/react";
import { useState, useEffect } from "react";

import DefaultLayout from "@/layouts/default";
import { useAuth } from "@/providers/AuthProvider";
import { BackButton } from "@/components/BackButton";
import { supabase } from "@/supabaseClient";
import withAuth from "@/hocs/withAuth";
import { LoadingSpinner } from "@/components/LoadingSpinner";

function UserHomePage() {
  const { session, profile } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      getUser();
    }
  }, [session]);

  const getUser = async () => {
    setIsLoading(true);
    if (session?.user.id) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
      } else {
        setUserProfile(data);
      }
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col justify-center items-center w">
        <div className="flex flex-col mx-auto w-full max-w-[400px]">
          <BackButton
            subtitulo={`Olá, ${profile?.name}`}
            titulo="Página Inicial"
          />
        </div>

        <div className="flex flex-col gap-6 w-full max-w-[400px]">
          <Card className="w-full">
            <CardHeader>
              <h3 className="font-semibold text-xl">Informações do Usuário</h3>
            </CardHeader>
            <CardBody>
              <p>
                <strong>Nome:</strong> {profile?.name || "Nome não disponível"}{" "}
                {profile?.last_name || ""}
              </p>
              <p>
                <strong>Email:</strong> {session?.user.email}
              </p>
              <p>
                <strong>Especialidade:</strong>{" "}
                {profile?.area_de_atuacao || "Especialidade não definida"}
              </p>
            </CardBody>
          </Card>

          <Card className="w-full max-w-[400px]">
            <CardHeader>
              <h3 className="font-semibold text-xl">Ações Rápidas</h3>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-4">
                <Link href="/user/profile">
                  <Button fullWidth color="primary">
                    Editar Perfil
                  </Button>
                </Link>
                <Link href="/patient/list">
                  <Button fullWidth color="secondary">
                    Pacientes
                  </Button>
                </Link>
                <Link href="/support">
                  <Button fullWidth color="success">
                    Suporte
                  </Button>
                </Link>
                <Link href="/logout">
                  <Button fullWidth color="danger">
                    Sair da Conta
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}

export default withAuth(UserHomePage);
