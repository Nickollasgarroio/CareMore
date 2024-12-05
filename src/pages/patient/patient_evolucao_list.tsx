/* eslint-disable no-console */
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Divider,
} from "@nextui-org/react";

import DefaultLayout from "@/layouts/default";
import { BackButton } from "@/components/BackButton";
import { EvolucaoSchema } from "@/schemas/UserSchemas";
import { EvolucaoType } from "@/types/FormDataTypes";
import { EvolucaoCard } from "@/components/Evolucao/evolucaoCard";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/supabaseClient";
import { formatDate } from "@/utils/textUtils";

export default function PatientEvolucaoListPage() {
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const paciente = location.state.pac;

  const [evolucoes, setEvolucoes] = useState<EvolucaoType[]>([]);

  const methods = useForm<EvolucaoType>({
    resolver: zodResolver(EvolucaoSchema),
    mode: "onChange",
    defaultValues: {
      prof_id: session?.user.id,
      pac_id: paciente.pac_id,
    },
  });

  const { setError } = methods;

  // Função para buscar evoluções no Supabase

  const fetchEvolucoes = async () => {
    const { data, error } = await supabase
      .from("evolucoes")
      .select("*")
      .eq("pac_id", paciente.pac_id)
      .eq("prof_id", session?.user.id)
      .order("date", { ascending: false });

    if (error) {
      console.error("Erro ao buscar evoluções:", error.message);
    } else {
      setEvolucoes(data);
    }
  };

  // Chama a função de busca assim que o componente é montado
  useEffect(() => {
    fetchEvolucoes();
  }, [paciente.pac_id]);

  useEffect(() => {
    fetchEvolucoes();
  }, []);

  const onSubmitSupabase = async (data: EvolucaoType) => {
    const { error } = await supabase.from("evolucoes").insert([data]);

    if (error) {
      console.log(error);
      setError("root", { message: error.message });
    } else {
      console.log(`Evolução cadastrada com sucesso`);
    }
  };

  const handleEdit = async (updatedEvolucao: EvolucaoType) => {
    const { id, ...data } = updatedEvolucao;
    const { error } = await supabase
      .from("evolucoes")
      .update(data)
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar evolução:", error.message);
    } else {
      console.log("Evolução atualizada com sucesso");
      fetchEvolucoes(); // Atualiza a lista após edição
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("evolucoes").delete().eq("id", id);

    if (error) {
      console.error("Erro ao deletar evolução:", error.message);
    } else {
      console.log("Evolução deletada com sucesso");
      // Recarrega a lista de evoluções após deletar
      fetchEvolucoes();
    }
  };

  return (
    <DefaultLayout>
      <section>
        <BackButton subtitulo="Lista de Evolução" titulo="Evolução" />
      </section>
      <div className="flex flex-col gap-4">
        {/* Exibindo os cards de evolução */}
        <div className="flex justify-center">
          {evolucoes.length > 0 && (
            <div className="flex justify-center">
              <Button
                color="primary"
                onClick={() =>
                  navigate("/patient/evolucao/create", {
                    state: { paciente: paciente },
                  })
                }
              >
                Nova Evolução
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 mx-auto w-[90%] max-w-[600px]">
          {evolucoes.length > 0 ? (
            evolucoes.map((evolucao) => (
              <>
                <Accordion
                  key={evolucao.id}
                  className="w-[90%] max-w-[600px] mx-auto text-center"
                  variant="shadow"
                >
                  <AccordionItem
                    title={`${formatDate(evolucao.date)} - ${evolucao.queixa.normalize()}`}
                  >
                    <EvolucaoCard
                      key={evolucao.id} // Assumindo que cada evolução tem um id único
                      evolucao={evolucao}
                      onDelete={() => evolucao.id && handleDelete(evolucao.id)}
                      onEdit={handleEdit}
                    />
                  </AccordionItem>
                </Accordion>
              </>
            ))
          ) : (
            <Card className="w-[90%] max-w-[600px] mx-auto">
              <CardBody className="text-center p-10 flex flex-col gap-4 ">
                <p className="text-center">
                  Nenhuma evolução encontrada para este paciente.
                </p>
                <Button
                  color="primary"
                  className="mx-auto"
                  onClick={() =>
                    navigate("/patient/evolucao/create", {
                      state: { paciente: paciente },
                    })
                  }
                >
                  Nova Evolução
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
