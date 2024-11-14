import { Button, Link } from "@nextui-org/react";
import { title } from "@/components/primitives";

import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <title className={title()}>Opções</title>
        <div className="flex gap-4 max-w-450px mt-24 grid">
          <Link href="/user/prontuarios">
            <Button color="primary" size="lg">
              Prontuarios
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button color="primary" size="lg">
              Cadastro Pacientes
            </Button>
          </Link>
          <Link href="/user/login">
            <Button color="primary" size="lg">
              Log in
            </Button>
          </Link>
          <Link href="/user/home">
            <Button color="primary" size="lg">
              Home Page
            </Button>
          </Link>
          <Link href="/user/pacientes/evolucao">
            <Button color="primary" size="lg">
              Evolução Pacientes
            </Button>
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
