import {
  Spacer,
  Button,
  useDisclosure,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import DefaultLayout from "@/layouts/default";
import { title, subtitle } from "@/components/primitives";
import { UserProfileSchema } from "@/schemas/cadastroUserSchema";
import { UserProfile } from "@/types/FormDataTypes";
import { BgCard } from "@/components/bg-card";
import { CadastroModal } from "@/components/CadastroModal";
import { supabase } from "@/supabaseClient";
import {
  PersonalInfoStep,
  ProfessionalInfoStep,
  ContactInfoStep,
  LocalidadeInfoStep,
} from "@/components/ProfileForm/steps/ProfileFormSteps";

export default function UserProfileCreatePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("pessoal");

  const steps = ["pessoal", "localidade", "profissional", "contato"];
  const currentStepIndex = steps.indexOf(currentPage);

  const methods = useForm<UserProfile>({
    resolver: zodResolver(UserProfileSchema),
    mode: "onChange",
    defaultValues: {},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = methods;

  const onSubmitSupabase = async (data: UserProfile) => {
    const { error } = await supabase.from("profiles").insert([data]);

    if (error) setError(error.message);
    else onOpen();
  };

  const testSubmit = (data: UserProfile) => {
    console.log(data);
  };

  // Função para avançar para a próxima etapa
  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentPage(steps[currentStepIndex + 1]);
    } else {
      // Enviar o formulário na última etapa
      handleSubmit(onSubmitSupabase)();
    }
  };

  // Função para voltar para a etapa anterior
  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentPage(steps[currentStepIndex - 1]);
    }
  };

  // Função para renderizar o componente correto de acordo com a página atual
  const renderStepComponent = () => {
    switch (currentPage) {
      case "pessoal":
        return (
          <PersonalInfoStep
            control={control}
            errors={errors}
            register={register}
          />
        );
      case "localidade":
        return (
          <LocalidadeInfoStep
            errors={errors}
            register={register}
            watch={watch}
          />
        );
      case "profissional":
        return <ProfessionalInfoStep errors={errors} register={register} />;
      case "contato":
        return <ContactInfoStep errors={errors} register={register} />;
      default:
        return null;
    }
  };

  const valores = watch();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title({ color: "blue", size: "lg" })}>
            Seja Bem-vindo(a)!
          </h1>
          <h1 className={subtitle()}>Cadastro</h1>
        </div>
      </section>
      <div>
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-4 max-w-[400px] mx-auto"
            onSubmit={handleSubmit(onSubmitSupabase)}
          >
            <Spacer />
            <Breadcrumbs underline="active">
              <BreadcrumbItem
                isCurrent={currentPage === "pessoal"}
                onPress={() => setCurrentPage("pessoal")}
              >
                Pessoal
              </BreadcrumbItem>
              <BreadcrumbItem
                isCurrent={currentPage === "localidade"}
                onPress={() => setCurrentPage("localidade")}
              >
                Localidade
              </BreadcrumbItem>
              <BreadcrumbItem
                isCurrent={currentPage === "profissional"}
                onPress={() => setCurrentPage("profissional")}
              >
                Profissional
              </BreadcrumbItem>
              <BreadcrumbItem
                isCurrent={currentPage === "contato"}
                onPress={() => setCurrentPage("contato")}
              >
                Contato
              </BreadcrumbItem>
            </Breadcrumbs>
            <BgCard className="flex flex-col gap-4 max-w-[400px]">
              {renderStepComponent()}
            </BgCard>
            <Spacer />
            <div className="flex flex-row gap-4 mx-auto">
              {currentStepIndex > 0 && (
                <Button color="danger" onPress={handlePreviousStep}>
                  Voltar
                </Button>
              )}
              <Button color="primary" onPress={handleNextStep}>
                {currentStepIndex === steps.length - 1 ? "Enviar" : "Próximo"}
              </Button>
            </div>
          </form>
        </FormProvider>
        {/* <pre>{JSON.stringify(valores, null, 2)}</pre> */}
        <CadastroModal
          error={error ? error : ""}
          isOpen={isOpen}
          message={
            error
              ? `Houve um problema ao fazer o cadastro:`
              : "Cadastro realizado com sucesso!"
          }
          status={error ? "error" : "success"}
          onOpenChange={onOpenChange}
        />
      </div>
    </DefaultLayout>
  );
}
