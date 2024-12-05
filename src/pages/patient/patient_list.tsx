import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
} from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "@/providers/AuthProvider";
import { BackButton } from "@/components/BackButton";
import DefaultLayout from "@/layouts/default";
import { supabase } from "@/supabaseClient";
import { PacFormData } from "@/types/FormDataTypes";
import withAuth from "@/hocs/withAuth";
import { formatDate } from "@/utils/textUtils";
import { EyeIcon } from "@/assets/icon/Icons";

function UserListaPacientes() {
  const { session } = useAuth();
  const [pacientes, setPacientes] = useState<PacFormData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user.id) {
        const { data, error } = await supabase
          .from("pacientes")
          .select("*")
          .eq("prof_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar perfil:", error.message);
        } else if (data) {
          console.log("Dados recuperados:", data);
          setPacientes(data);
        }
      }
    };

    fetchUserProfile();
  }, [session]);

  return (
    <DefaultLayout>
      <section className="flex flex-col max-w-[600px] mx-auto">
        <BackButton subtitulo="Ver prontuarios" titulo="Prontuarios" />
      </section>

      <div className="flex flex-col w-full max-w-[600px] mx-auto gap-4">
        <Button
          className="w-fit mx-auto"
          color="primary"
          onClick={() => navigate("/patient/create")}
        >
          Novo Paciente
        </Button>
        <Table className="rounded-2xl">
          <TableHeader>
            <TableColumn key={"name"} className="text-end">
              NOME
            </TableColumn>
            <TableColumn key={"status"}>NASCIMENTO</TableColumn>
            <TableColumn key={"birth_date"}>STATUS</TableColumn>
            <TableColumn key={"action"}>AÇÕES</TableColumn>
          </TableHeader>
          <TableBody items={pacientes}>
            {(item) => (
              <TableRow key={item.pac_id}>
                <TableCell className="text-end">{item.name || ""}</TableCell>
                <TableCell>{formatDate(item.birth_date.toString())}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell className="left-3">
                  <div className="">
                    <Tooltip content="Visualizar prontuario" delay={300}>
                      <Button
                        isIconOnly
                        color="primary"
                        className="rounded-full"
                        onClick={() => {
                          navigate("/patient/prontuario", {
                            state: { pac_id: item.pac_id },
                          });
                        }}
                      >
                        <EyeIcon />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DefaultLayout>
  );
}

export default withAuth(UserListaPacientes);
