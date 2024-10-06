import {
  Button,
  DatePicker,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
  User,
  Link,
} from "@nextui-org/react";
import { useState } from "react";
import DefaultLayout from "@/layouts/default";

export default function ProntuariosPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    pac_nome: "Nickollas Giordano Arroio",
    pac_idade: "26",
    prof_name: "Helen Gimenes",
    prof_espec: "Fonoaudiologia",
    prof_registro: "1 23456",
  });

  return (
    <DefaultLayout>
      <form className="flex flex-col mx-auto gap-4 max-w-[400px]">
        <div className="flex flex-row gap-4">
          <Popover showArrow placement="bottom" offset={20}>
            <PopoverTrigger>
              <Input
                label="Nome do Paciente"
                labelPlacement="outside"
                value={formData.pac_nome}
              ></Input>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col p-4">
                <User
                  as="button"
                  name={formData.pac_nome}
                  description={`${formData.pac_idade} anos`}
                ></User>
                <Link className="text-xs justify-end">Editar</Link>
              </div>
            </PopoverContent>
          </Popover>

          <Input
            className="w-14 text-center"
            label="Idade"
            labelPlacement="outside"
            value={formData.pac_idade}
            isDisabled
          ></Input>
        </div>

        <DatePicker
          label="Data do atendimento"
          labelPlacement="outside"
          isRequired={true}
        />
        <Textarea
          label="Evolução do paciente"
          labelPlacement="outside"
          minRows={20}
          maxRows={40}
          isRequired={true}
        />
        <Button type="submit" color="primary" className="max-w-16 self-center">
          Enviar
        </Button>
      </form>
    </DefaultLayout>
  );
}
