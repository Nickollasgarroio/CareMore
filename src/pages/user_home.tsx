import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { useState, useEffect } from "react";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/supabaseClient";

export default function UserHomePage() {
  const { session, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);

  // Função para buscar o perfil do usuário
  const getUser = async () => {
    if (session?.user.id) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single(); // O .single() retorna um único item, já que estamos buscando por id

      if (error) {
        console.error("Erro ao buscar perfil:", error);
      } else {
        setUserProfile(data); // Atualiza o estado com os dados do perfil
      }
    }
  };

  // Chama a função getUser quando a sessão mudar ou for carregada
  useEffect(() => {
    if (!loading && session) {
      getUser();
    }
  }, [loading, session]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title({ color: "blue" })}>Página Inicial</h1>
          <h1 className={subtitle()}>Olá!</h1>
        </div>
        {/* Exibe o nome do usuário, se disponível */}
        <div>{userProfile ? userProfile.name : "Carregando perfil..."}</div>
        {<pre>{JSON.stringify(userProfile)}</pre>}
        <div className="w-[90%] max-w-[450px] grid grid-cols-2 gap-4">
          <Card isHoverable isPressable className="w-full">
            <CardHeader>
              <h1 className="md:font-xl font-medium md:text-2xl ">Pacientes</h1>
            </CardHeader>
            W<CardBody>Veja a sua lista de Pacientes</CardBody>
          </Card>
          <Link href="/user/prontuarios">
            <Card isHoverable isPressable className="w-full">
              <CardHeader>
                <h1 className="font-xl font-medium md:text-2xl ">
                  Prontuarios
                </h1>
              </CardHeader>
              <CardBody>
                <p>Veja seus Prontuarios</p>
              </CardBody>
            </Card>
          </Link>
          <Card isHoverable isPressable className="w-full">
            <CardHeader>
              <h1 className="font-xl font-medium md:text-2xl ">Meu Perfil</h1>
            </CardHeader>
            <CardBody>
              <p>Edite seu Perfil Profissional</p>
            </CardBody>
          </Card>
          <Card isHoverable isPressable className="w-full">
            <CardHeader>
              <h1 className="font-xl font-medium md:text-2xl ">
                Configurações
              </h1>
            </CardHeader>
            <CardBody>
              <p>Edite suas Configurações e Preferências</p>
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
