import {
  Button,
  Card,
  Divider,
  Spacer,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FormProvider, set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useHookFormMask } from "use-mask-input";

import { useAuth } from "@/providers/AuthProvider";
import { BackButton } from "@/components/BackButton";
import DefaultLayout from "@/layouts/default";
import { supabase } from "@/supabaseClient";
import { PacFormData } from "@/types/FormDataTypes";
import withAuth from "@/hocs/withAuth";
import { calculateAge } from "@/utils/calculateAge";
import formSchema from "@/schemas/formSchemas";
import {
  PersonalInfoStep,
  ContactInfoStep,
  LocalidadeInfoStep,
  ResponsavelInfoStepProps,
} from "@/components/PatientProfileForm/steps/PatientFormSteps";
import { ModalConfirmation } from "@/components/modal_confirmation";
import { CadastroModal } from "@/components/CadastroModal";
import { ErrorViewer } from "@/components/ErrorViewer";

function PacienteProntuario() {
  const methods = useForm<PacFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
    watch,
  } = methods;

  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [paciente, setPaciente] = useState<PacFormData>();
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen, isOpen, onOpenChange } = useDisclosure(); // Modal confirmação

  const pacId = location.state.pac_id;
  const idade = calculateAge(paciente?.birth_date || "");

  const [isCadastroModalOpen, setCadastroModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const openCadastroModal = () => setCadastroModalOpen(true);
  const closeCadastroModal = () => setCadastroModalOpen(false);

  const openConfirmationModal = () => setConfirmationModalOpen(true);
  const closeConfirmationModal = () => setConfirmationModalOpen(false);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      if (session?.user.id) {
        const { data, error } = await supabase
          .from("pacientes")
          .select("*")
          .eq("prof_id", session.user.id)
          .eq("pac_id", pacId)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar perfil:", error.message);
          setError(error.message);
        } else if (data) {
          setPaciente(data);
        }
      }
    };

    fetchPatientProfile();
  }, [session, pacId]);

  useEffect(() => {
    if (paciente) {
      reset({
        ...paciente,
        prof_id: session?.user.id,
        pac_id: paciente.pac_id,
        pac_has_resp: !!paciente.pac_has_resp,
        resp_name: paciente.pac_has_resp ? paciente.resp_name || "" : "",
        resp_email: paciente.pac_has_resp ? paciente.resp_email || "" : "",
        resp_whatsapp: paciente.pac_has_resp
          ? paciente.resp_whatsapp || ""
          : "",
        resp_education: paciente.pac_has_resp
          ? paciente.resp_education || ""
          : "",
        resp_occupation: paciente.pac_has_resp
          ? paciente.resp_occupation || ""
          : "",
        addrs_comp: paciente.addrs_comp ? paciente.addrs_comp || "" : "",
        cpf: paciente.cpf || "",
      });
    }
  }, [paciente, reset]);

  const onSubmitSupabase = async (data: PacFormData) => {
    if (!isEditing) return; // Certifica-se de que está no modo de edição
    console.log("Dados enviados:", data);

    const { error } = await supabase
      .from("pacientes")
      .update([data])
      .eq("pac_id", pacId)
      .eq("prof_id", session?.user.id);

    if (error) {
      console.log(error);
      setError(error.message);
    } else {
      console.log("Paciente atualizado com sucesso");
      // openCadastroModal(); // Abre o modal
      setIsEditing(false); // Sai do modo de edição
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("pacientes")
      .delete()
      .eq("pac_id", pacId)
      .eq("prof_id", session?.user.id);

    if (error) {
      console.log(error);
      setError(error.message);
    } else {
      console.log("Paciente excluído com sucesso");
      navigate("/patient/list"); // Redireciona após exclusão
    }
    onOpenChange();
  };
  const values = watch();

  return (
    <DefaultLayout>
      <section className="flex flex-col max-w-[400px] mx-auto">
        <BackButton subtitulo="Ver prontuarios" titulo="Prontuarios" />
      </section>
      <div className="w-[90%] max-w-[600px] mx-auto">
        <Card className="p-4">
          <FormProvider {...methods}>
            <form noValidate onSubmit={handleSubmit(onSubmitSupabase)}>
              <div className="flex flex-col my-4">
                <h1 className="text-2xl font-bold text-center">
                  {paciente?.name}
                </h1>
                <p className="text-sm  text-center">
                  {paciente?.sex}, {idade}
                </p>
              </div>
              <Spacer y={2} />
              <div className="flex justify-center">
                <Button
                  className="m-2"
                  color="primary"
                  onClick={() =>
                    navigate("/patient/evolucao/list", {
                      state: { pac: paciente },
                    })
                  }
                >
                  Evoluções
                </Button>
              </div>
              <Divider />
              <Spacer y={4} />
              {/* Tabs de informações */}
              <div className="flex flex-col">
                <Tabs className="flex flex-col">
                  <Tab
                    key="pessoal"
                    title="Pessoal"
                    className="flex flex-col gap-4"
                  >
                    <PersonalInfoStep
                      isEditing={isEditing}
                      control={control}
                      errors={errors}
                      register={(name) => ({
                        ...register(name),
                        readOnly: !isEditing,
                      })}
                    />
                  </Tab>
                  <Tab
                    key="Endereço"
                    title="Endereço"
                    className="flex flex-col gap-4"
                  >
                    <LocalidadeInfoStep
                      readOnly={isEditing}
                      register={register}
                      control={control}
                      errors={errors}
                      watch={watch}
                      setValue={setValue}
                    />
                  </Tab>
                  <Tab
                    key="Contato"
                    title="Contato"
                    className="flex flex-col gap-4"
                  >
                    <ContactInfoStep
                      readOnly={isEditing}
                      control={control}
                      errors={errors}
                      register={(name) => ({
                        ...register(name),
                        readOnly: !isEditing,
                      })}
                    />
                  </Tab>

                  <Tab
                    key="Responsável"
                    isDisabled={!paciente?.pac_has_resp}
                    title="Responsável"
                    className="flex flex-col gap-4"
                  >
                    <ResponsavelInfoStepProps
                      isEditing={isEditing}
                      control={control}
                      errors={errors}
                      hasResp={!!paciente?.pac_has_resp}
                      register={(name) => ({
                        ...register(name),
                        readOnly: !isEditing,
                      })}
                    />
                  </Tab>
                </Tabs>
              </div>

              <div className="flex gap-4 justify-center mt-4">
                <Button
                  color="danger"
                  onClick={(e) => {
                    e.preventDefault(); // Evita comportamentos indesejados
                    openConfirmationModal();
                  }}
                >
                  Deletar
                </Button>
                {isEditing ? (
                  <Button color="success" type="submit">
                    Salvar
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault(); // Impede envio do formulário
                      setIsEditing(true); // Ativa modo de edição
                    }}
                  >
                    Editar
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
      <CadastroModal
        error={error ? error : ""}
        isOpen={isCadastroModalOpen}
        message={
          error
            ? `Houve um problema a fazer a alteração: ${error}`
            : "Alteração realizada com sucesso!"
        }
        status={error ? "error" : "success"}
        onOpenChange={setCadastroModalOpen}
      />
      <ModalConfirmation
        description="Tem certeza de que deseja excluir este paciente?"
        isOpen={isConfirmationModalOpen}
        title="Excluir paciente"
        onConfirm={handleDelete}
        onOpenChange={setConfirmationModalOpen}
        confirmColor="danger"
      />
      {/* <pre>
        <code>{JSON.stringify(values, null, 2)}</code>
      </pre>
      <ErrorViewer errors={errors} /> */}
    </DefaultLayout>
  );
}

export default withAuth(PacienteProntuario);
