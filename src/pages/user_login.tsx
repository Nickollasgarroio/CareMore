import { Spacer, Input, Button } from "@nextui-org/react";
import { Link as LinkNext } from "@nextui-org/react";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Link } from "react-router-dom";

export default function UserLoginPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 i md:py-10 ">
      <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title({ color: "blue", size: "lg" })}>
            Seja Bem-vindo(a)!
          </h1>
          <h1 className={subtitle()}>Login</h1>
        </div>
      </section>
      <div className="flex flex-col gap-4 max-w-[400px] mx-auto">
        <Spacer />
        <Input
          label="Email"
          labelPlacement="outside"
          placeholder="Email"
          type="email"
        />
        <Input
          label="Senha"
          labelPlacement="outside"
          placeholder="Senha"
          type="password"
        />
        <Spacer />
        <div className="flex flex-row gap-4 mx-auto">
          <Link to={"/user/cadastro"}>
            <Button variant="ghost" color="primary">
              Cadastro
            </Button>
          </Link>
          <Button color="primary">Login</Button>
        </div>
        <div className="flex flex-row gap-4 mx-auto">
          <p>Esqueceu sua senha?</p>
          <LinkNext href="/user/cadastro">Redefinir Senha</LinkNext>
        </div>
      </div>
    </DefaultLayout>
  );
}
