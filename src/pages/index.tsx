import { Button, Link } from "@nextui-org/react";
import { title } from "@/components/primitives";

import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <title className={title()}>Opções</title>
        <div className="flex flex-row gap-4 max-w-450px mt-24">
          <Link href="/prontuarios">
            <Button color="primary" size="lg">
              Prontuarios
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button color="primary" size="lg">
              Cadastro
            </Button>
          </Link>
          <Link href="/user/cadastro">
            <Button color="primary" size="lg">
              Log in
            </Button>
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
