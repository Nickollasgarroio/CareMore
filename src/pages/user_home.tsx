import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function UserHomePage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title({ color: "blue" })}>Página Inicial</h1>
          <h1 className={subtitle()}>Olá, Nickollas!</h1>
        </div>
        <div className="w-[90%] max-w-[450px] grid grid-cols-2 gap-4">
          <Card isHoverable isPressable className="w-full">
            <CardHeader>
              <h1 className="md:font-xl font-medium md:text-2xl ">Pacientes</h1>
            </CardHeader>
            <CardBody>Veja a sua lista de Pacientes</CardBody>
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
