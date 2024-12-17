import { Button, Link } from "@nextui-org/react";
import { title } from "@/components/primitives";

import DefaultLayout from "@/layouts/default";
import { useNavigate } from "react-router-dom";

export default function DevMenu() {
  const navigate = useNavigate();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <title className={title()}>Opções</title>
        <div className="flex flex-col gap-4 max-w-450px mt-24 ">
          <Button
            color="primary"
            size="lg"
            onClick={() => navigate("/patient/prontuario")}
          >
            Prontuarios
          </Button>

          <Button
            color="primary"
            size="lg"
            onClick={() => navigate("cadastro")}
          >
            Cadastro Pacientes
          </Button>

          <Button color="primary" size="lg" onClick={() => navigate("login")}>
            Log in
          </Button>

          <Button
            color="primary"
            size="lg"
            onClick={() => navigate("/user/home")}
          >
            Home Page
          </Button>

          <Button
            color="primary"
            size="lg"
            onClick={() => navigate("/user/pacientes/evolucao")}
          >
            Evolução Pacientes
          </Button>

          <Button
            color="primary"
            size="lg"
            onClick={() => navigate("/user/profile/create")}
          >
            Criar Perfil
          </Button>

          <Button
            color="primary"
            size="lg"
            onClick={() => navigate("/patient/list")}
          >
            Evolução
          </Button>
          <Button
            color="primary"
            size="lg"
            onClick={() => navigate("/user/update_password")}
          >
            Update Password
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}
