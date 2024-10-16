import React, { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  Textarea,
  DatePicker,
  Button,
  Spacer,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { today, getLocalTimeZone } from "@internationalized/date";

import FormData from "@/types/FormDataTypes";
import formSchema from "@/schemas/formSchemas";
import { supabase } from "@/supabaseClient";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

// Hook para buscar dados do Supabase
const useFetchPacientes = () => {
  const [dataTeste, setDataTeste] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: pacientes, error } = await supabase
      .from("pacientes")
      .select("pac_id, pac_name");

    if (error) {
      setError("Erro ao buscar pacientes");
      setDataTeste([]);
    } else {
      setDataTeste(pacientes);
    }
    setLoading(false);
  };

  return { dataTeste, loading, error, fetchData };
};

export default function ProntuariosPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
    mode: "onChange",
  });

  const { dataTeste, loading, error, fetchData } = useFetchPacientes();

  // useEffect para carregar dados ao montar a página
  useEffect(() => {
    fetchData();
  }, []); // O array vazio [] garante que o useEffect rode apenas uma vez, quando o componente for montado

  return (
    <DefaultLayout>
      <div className="w-[400px] flex flex-col gap-4 mx-auto">
        <h1 className={title()}>Prontuários</h1>
        <Spacer />
        <Select
          label="Paciente"
          labelPlacement="outside"
          placeholder="Selecione um paciente"
        >
          {dataTeste.map((paciente) => (
            <SelectItem key={paciente.pac_id} value={paciente.pac_id}>
              {loading ? "Carregando..." : paciente.pac_name}
            </SelectItem>
          ))}
        </Select>
        <DatePicker
          isRequired
          defaultValue={today(getLocalTimeZone())}
          label="Data do Prontuário"
          labelPlacement="outside"
          maxValue={today(getLocalTimeZone())}
        />
        <Textarea
          isRequired
          label="Evolução"
          labelPlacement="outside"
          minRows={10}
        />
        <Button className="w-fit mx-auto" color="primary" type="submit">
          Enviar
        </Button>
        {/* <div>{JSON.stringify(dataTeste)}</div> */}
      </div>
    </DefaultLayout>
  );
}
