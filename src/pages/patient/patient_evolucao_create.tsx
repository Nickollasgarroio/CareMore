/* eslint-disable no-console */
import {
  Button,
  Divider,
  Card,
  CardBody,
  DatePicker,
  Input,
  Textarea,
  useDisclosure,
  Spacer,
} from "@nextui-org/react";

import DefaultLayout from "@/layouts/default";
import { BackButton } from "@/components/BackButton";
import { EvolucaoSchema } from "@/schemas/UserSchemas";
import { EvolucaoType } from "@/types/FormDataTypes";

import "react-quill/dist/quill.snow.css"; // Importa o estilo do editor
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/providers/AuthProvider";

import { useLocation, useNavigate } from "react-router-dom";
import { DateValue, getLocalTimeZone, today } from "@internationalized/date";

import { supabase } from "@/supabaseClient";

import { useEffect, useState } from "react";

import { CadastroModal } from "@/components/CadastroModal";

export default function PatientEvolucaoCreatePage() {
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // useDisclosure para controlar o modal
  const [error, setError] = useState<string | null>(null);

  const paciente = location.state?.paciente || {
    pac_id: "",
    name: "Paciente desconhecido",
  };

  // Redireciona ou exibe uma mensagem se não houver estado
  useEffect(() => {
    if (!paciente) {
      console.error("Paciente não encontrado. Redirecionando...");
      navigate("/patient/evolucao/list"); // Altere para a rota correta
    }
  }, [paciente, navigate]);

  const methods = useForm<EvolucaoType>({
    resolver: zodResolver(EvolucaoSchema),
    mode: "onChange",
    defaultValues: {
      prof_id: session?.user.id,
      pac_id: paciente?.pac_id || "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = methods;

  const onSubmitSupabase = async (data: EvolucaoType) => {
    const { error } = await supabase.from("evolucoes").insert([data]);

    if (error) {
      console.log(error);
      setError(error.message);
      onOpen();
    } else {
      console.log(`Paciente cadastrado com sucesso`);
      onOpen();
    }
  };

  const handleDateChange = (value: DateValue | null) => {
    setValue("date", value ? value.toString() : "");
  };

  return paciente && session ? (
    <DefaultLayout>
      <BackButton subtitulo="Nova Evolução" titulo="Evolução" />
      <Card className="w-[90%] max-w-[600px] mx-auto">
        <CardBody>
          <form
            className="flex flex-col gap-4 w-[90%] max-w-[600px] mx-auto"
            onSubmit={handleSubmit(onSubmitSupabase)}
          >
            <Spacer y={2} />
            <h1 className="font-bold text-2xl text-center">{paciente.name}</h1>
            <Divider className="w-[90%] max-w-[400px] mx-auto " />
            <Spacer y={2} />
            <Input
              isRequired
              errorMessage={errors.queixa?.message}
              isInvalid={!!errors.queixa}
              label="Queixa"
              maxLength={50}
              placeholder="Ansiedade"
              {...register("queixa")}
              description="Máx. 50 caracteres"
            />
            <Controller
              control={control}
              name="date"
              render={() => (
                <DatePicker
                  isRequired
                  defaultValue={today(getLocalTimeZone())}
                  errorMessage={errors.date?.message}
                  isInvalid={!!errors.date}
                  label="Data"
                  maxValue={today(getLocalTimeZone())}
                  onChange={handleDateChange}
                />
              )}
            />
            <Textarea
              isRequired
              description="Máx. 2000 caracteres"
              errorMessage={errors.observacao?.message}
              isInvalid={!!errors.observacao}
              label="Observações"
              maxLength={2000}
              placeholder="Escreva aqui"
              {...register("observacao")}
            />
            <Button className="w-fit mx-auto" color="primary" type="submit">
              Salvar
            </Button>
            <Spacer y={2} />
            <CadastroModal
              error={error ? error : ""}
              isOpen={isOpen}
              message={
                error
                  ? `Houve um problema ao fazer o cadastro: ${error}`
                  : "Cadastro realizado com sucesso!"
              }
              status={error ? "error" : "success"}
              onOpenChange={onOpenChange}
            />
          </form>
        </CardBody>
      </Card>

      {/* {JSON.stringify(errors)} */}
    </DefaultLayout>
  ) : (
    <p>Carregando...</p>
  );
}
