/* eslint-disable no-console */
import { useState, useEffect } from "react";
import {
  Button,
  Select,
  SelectItem,
  DatePicker,
  Spacer,
  useDisclosure,
  Card,
  CardBody,
  Switch,
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateValue, getLocalTimeZone, today } from "@internationalized/date";
import { useHookFormMask } from "use-mask-input";
import { useNavigate } from "react-router-dom";

import { PacFormData } from "@/types/FormDataTypes";
import { estadosUF, generos } from "@/config/cadastroConfigs";
import formSchema from "@/schemas/formSchemas";
import { supabase } from "@/supabaseClient";
import withAuth from "@/hocs/withAuth";
import DefaultLayout from "@/layouts/default";
import { CadastroModal } from "@/components/CadastroModal";
import { useAuth } from "@/providers/AuthProvider";
import { CitySelect } from "@/components/ProfileForm/citySelect";
import { BackButton } from "@/components/BackButton";
import { ErrorViewer } from "@/components/ErrorViewer";

function PatientCadastro() {
  const { session, loading } = useAuth();

  const methods = useForm<PacFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      prof_id: session?.user.id,
      pac_has_resp: false,
      status: "Ativo",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    getValues,
    watch, // Import this function
  } = methods;

  const navigate = useNavigate();
  const values = watch();
  const hasResp = watch("pac_has_resp");

  const registerWithMask = useHookFormMask(register);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure(); //declaração para uso do hook do modal
  const onSubmitSupabase = async (data: PacFormData) => {
    // Enviar dados para o Supabase
    const { error } = await supabase.from("pacientes").insert([data]);

    if (error) {
      console.log(error);
      setError(error.message);
    } else {
      console.log(`Paciente Cadastrado com sucesso`);
      onOpen();
      navigate("/patient/list");
    }
    onOpen();
  };
  const handleDateChange = (value: DateValue | null) => {
    if (value) {
      const formattedDate = value.toString(); // Convert to string

      setValue("birth_date", formattedDate);
    } else {
      setValue("birth_date", ""); // Clear the value if null
    }
  };

  // Usar o hook para buscar o endereço com base no CEP

  const checkCEP = (event: React.FocusEvent<HTMLInputElement> | FocusEvent) => {
    const inputEvent = event as React.FocusEvent<HTMLInputElement>;
    const CEP = inputEvent.target.value.replace(/\D/g, "");

    fetch(`https://viacep.com.br/ws/${CEP}/json`, {})
      .then((response) => response.json())
      .then((data) => {
        console.log("CEP consultado com sucesso", data);
        setValue("addrs_street_name", data.logradouro);
        setValue("addrs_bairro", data.bairro);
        setValue("addrs_city", data.localidade);
        setValue("addrs_uf", data.uf);
        setValue("addrs_zip", CEP);
      });
  };

  useEffect(() => {
    if (!loading && !session) {
      navigate("/login");
    }
  }, [loading, session]); // Remova o "navigate" das dependências

  useEffect(() => {
    if (session?.user.id) {
      setValue("prof_id", session.user.id);
    }
  }, [session?.user.id]); // Inclua dependências corretas

  // Preencher os campos de endereço quando o hook retornar dados

  return (
    <DefaultLayout>
      <section className="flex flex-col">
        <BackButton subtitulo="Novo Paciente" titulo="Cadastro" />
      </section>
      <form noValidate onSubmit={handleSubmit(onSubmitSupabase)}>
        <div className="max-w-[600px] mx-auto flex flex-col gap-4">
          <Card>
            <CardBody className="flex flex-col gap-4 p-4 my-4">
              <Input
                isRequired
                errorMessage={errors.name?.message}
                isInvalid={errors.name ? true : false}
                label="Nome do Paciente"
                labelPlacement="outside"
                placeholder="Digite seu Nome"
                {...register("name")}
              />
              <Controller
                control={control}
                name="sex"
                render={() => (
                  <Select
                    isRequired
                    errorMessage={errors.sex?.message}
                    isInvalid={errors.sex ? true : false}
                    label="Sexo"
                    labelPlacement="outside"
                    placeholder="Masculino"
                    {...register("sex")}
                  >
                    {generos.map((genero) => (
                      <SelectItem key={genero} value={genero}>
                        {genero}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="birth_date"
                render={({}) => (
                  <DatePicker
                    isRequired
                    label="Data de Nascimento"
                    labelPlacement="outside"
                    maxValue={today(getLocalTimeZone())}
                    onChange={handleDateChange}
                  />
                )}
              />
              <Input
                isRequired
                errorMessage={errors.whatsapp?.message}
                isInvalid={errors.whatsapp ? true : false}
                label="Telefone"
                labelPlacement="outside"
                placeholder="11 12345-6789"
                {...registerWithMask("whatsapp", "99 99999-9999")}
              />
              <Input
                isRequired
                errorMessage={errors.email?.message}
                isInvalid={errors.email ? true : false}
                label="Email"
                labelPlacement="outside"
                placeholder="exemplo@exemplo.com"
                {...register("email")}
              />
              <Input
                errorMessage={errors.cpf?.message}
                isInvalid={errors.cpf ? true : false} // Inverter a condição
                label="CPF"
                labelPlacement="outside"
                placeholder="Digite seu CPF"
                {...registerWithMask("cpf", "cpf")}
              />

              <Controller
                control={control}
                name="addrs_zip"
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    errorMessage={errors.addrs_zip?.message}
                    isInvalid={!!errors.addrs_zip}
                    label="CEP"
                    labelPlacement="outside"
                    placeholder="00000-000"
                    {...registerWithMask("addrs_zip", "99999-999")}
                    onBlur={(e) => {
                      field.onBlur();
                      checkCEP(e as React.FocusEvent<HTMLInputElement>); // Consulta o CEP ao sair do campo
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="addrs_street_name"
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    errorMessage={errors.addrs_street_name?.message}
                    isInvalid={!!errors.addrs_street_name}
                    label="Endereço"
                    labelPlacement="outside"
                    placeholder="Av. Paulista"
                    value={field.value || ""} // Garante que o valor é atualizado
                  />
                )}
              />
              <div className="flex gap-4">
                <Controller
                  control={control}
                  name="addrs_bairro"
                  render={({ field }) => (
                    <Input
                      {...field}
                      isRequired
                      className="w-3/4"
                      errorMessage={errors.addrs_bairro?.message}
                      isInvalid={!!errors.addrs_bairro}
                      label="Bairro"
                      labelPlacement="outside"
                      placeholder="Bela Vista"
                      value={field.value || ""}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="addrs_num"
                  render={({ field }) => (
                    <Input
                      {...field}
                      isRequired
                      className="w-1/4"
                      errorMessage={errors.addrs_num?.message}
                      isInvalid={!!errors.addrs_num}
                      label="Número"
                      labelPlacement="outside"
                      placeholder="3012"
                      value={field.value || ""}
                    />
                  )}
                />
              </div>
              <div className=" flex gap-4">
                <Controller
                  control={control}
                  name="addrs_uf"
                  render={({ field }) => (
                    <Select
                      isRequired
                      className="w-1/4 max-w-[80px]"
                      errorMessage={errors.addrs_uf?.message}
                      isInvalid={!!errors.addrs_uf} // Simplificação da verificação de erro
                      label="Estado"
                      labelPlacement="outside"
                      placeholder="SP"
                      selectedKeys={field.value ? [field.value] : []} // Corrige a seleção do item atual
                      onSelectionChange={(selected) => field.onChange(selected)} // Captura a mudança no campo
                      {...field} // Garante que `field` tenha prioridade sobre outras props
                    >
                      {estadosUF.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
                <Controller
                  control={control}
                  name="addrs_city"
                  render={({ field }) => (
                    <CitySelect
                      control={control}
                      errors={errors}
                      name="addrs_city"
                      setValue={setValue}
                      uf={values.addrs_uf}
                    />
                  )}
                />
              </div>
              <Controller
                control={control}
                name="addrs_comp"
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.addrs_comp?.message}
                    isInvalid={!!errors.addrs_comp}
                    label="Complemento"
                    labelPlacement="outside"
                    placeholder="Complemento"
                    value={field.value || ""}
                  />
                )}
              />

              <Spacer />

              <Switch
                size="sm"
                onClick={() => {
                  setValue("pac_has_resp", !hasResp);
                }}
              >
                Paciente tem responsável
              </Switch>
              <Spacer />

              {/* <Divider className="" /> */}
              {!!hasResp && (
                <div className="flex flex-col gap-4">
                  <Input
                    errorMessage={errors.resp_name?.message}
                    isInvalid={!!errors.resp_name} // Use double negation to ensure boolean type
                    isRequired={hasResp} // Conditionally make the field required based on hasResp
                    label="Nome"
                    labelPlacement="outside"
                    placeholder="Emilia Rodrigues"
                    value={values.resp_name || ""}
                    {...register("resp_name")}
                  />

                  <Input
                    errorMessage={errors.resp_whatsapp?.message}
                    isInvalid={errors.resp_whatsapp ? true : false}
                    isRequired={hasResp} // Torna o campo obrigatório se o checkbox estiver desmarcado
                    label="Telefone"
                    labelPlacement="outside"
                    placeholder="11 99999-9999"
                    value={values.resp_whatsapp || ""}
                    {...registerWithMask("resp_whatsapp", "99 99999-9999")}
                  />

                  <Input
                    errorMessage={errors.resp_email?.message}
                    isInvalid={!!errors.resp_email ? true : false}
                    isRequired={hasResp} // Torna o campo obrigatório se o checkbox estiver desmarcado
                    label="Email"
                    labelPlacement="outside"
                    placeholder="johndean@example.com"
                    type="email"
                    value={values.resp_email || ""}
                    {...register("resp_email")}
                  />

                  <Input
                    errorMessage={errors.resp_occupation?.message}
                    isInvalid={errors.resp_occupation ? true : false}
                    isRequired={hasResp} // Torna o campo obrigatório se o checkbox estiver desmarcado
                    label="Ocupação"
                    labelPlacement="outside"
                    placeholder="Bancário"
                    value={values.resp_occupation || ""}
                    {...register("resp_occupation")}
                  />
                  <Input
                    errorMessage={errors.resp_occupation?.message}
                    isInvalid={errors.resp_education ? true : false}
                    isRequired={hasResp} // Torna o campo obrigatório se o checkbox estiver desmarcado
                    label="Escolaridade"
                    labelPlacement="outside"
                    placeholder="Bancário"
                    value={values.resp_education || ""}
                    {...register("resp_education")}
                  />
                </div>
              )}
            </CardBody>
          </Card>

          <Button className="mx-auto" color="primary" type="submit">
            Enviar
          </Button>

          {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
          <ErrorViewer errors={errors} />
          <CadastroModal
            isOpen={isOpen}
            message={
              error
                ? `Erro ao enviar dados erro ${error}`
                : "Paciente cadastrado com Sucesso!"
            }
            status={error ? "error" : "success"}
            onOpenChange={onOpenChange}
          />
        </div>
      </form>
    </DefaultLayout>
  );
}

export default withAuth(PatientCadastro);
