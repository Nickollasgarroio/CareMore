/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@nextui-org/react";

import { supabase } from "../../supabaseClient";

import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Função de logout com atraso de 2 segundos
    const logout = async () => {
      // Espera 2 segundos antes de continuar
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Executa o logout
      await supabase.auth.signOut();
      // Redireciona para a página de login
      navigate("/login");
    };

    logout();
  }, [navigate]);

  return (
    <DefaultLayout>
      <div className="max-w-[400px] mx-auto h-full flex flex-col justify-center text-center gap-8">
        <h1 className={title({ color: "pink", size: "lg" })}>
          Saindo da sua conta
        </h1>

        <Spinner
          label="Até mais!👋"
          // labelColor="danger"
          // color="danger"
          size="lg"
        />
      </div>

      {/* Aqui você pode colocar qualquer conteúdo visual que deseja mostrar */}
    </DefaultLayout>
  );
};

export default Logout;
