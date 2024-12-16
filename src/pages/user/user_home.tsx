/* eslint-disable @typescript-eslint/no-unused-vars */

import { Card, CardBody, CardHeader, Button, Tooltip } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import DefaultLayout from "@/layouts/default";
import { useAuth } from "@/providers/AuthProvider";
import { BackButton } from "@/components/BackButton";
import { supabase } from "@/supabaseClient";
import withAuth from "@/hocs/withAuth";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

function UserHomePage() {
  const { session, profile } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
        navigate("/user/profile");
      } else {
        setUserProfile(data);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (session) {
      getUser();
    }
  }, [session]);

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
            titulo="Página Inicial"
            subtitulo={`Olá, ${profile?.name}`}
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
                <Link to="/user/profile">
                  <Button color="primary" fullWidth>
                    Editar Perfil
                  </Button>
                </Link>
                <Link to="/patient/list">
                  <Button color="secondary" fullWidth>
                    Pacientes
                  </Button>
                </Link>
                <Tooltip content="Em desenvolvimento">
                  <Button isDisabled color="success" fullWidth>
                    Suporte
                  </Button>
                </Tooltip>
                <Link to="/logout">
                  <Button color="danger" fullWidth>
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
