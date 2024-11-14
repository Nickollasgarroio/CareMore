import React, { useState } from "react";
import {
  Button,
  Select,
  SelectItem,
  DatePicker,
  Spacer,
  Checkbox,
  useDisclosure,
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateValue, getLocalTimeZone, today } from "@internationalized/date";
import { useHookFormMask } from "use-mask-input";

import { PacFormData } from "@/types/FormDataTypes";
import { estadosUF, generos } from "@/config/cadastroConfigs";
import formSchema from "@/schemas/formSchemas";
import { supabase } from "@/supabaseClient";
import { BgCard } from "@/components/bg-card";
import DefaultLayout from "@/layouts/default";
import { CadastroModal } from "@/components/CadastroModal";

export default function PatientCadastro() {
  // const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    getValues,
    watch, // Import this function
  } = useForm<PacFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pac_has_resp: true,
    },
    mode: "onChange", // This ensures validation runs on every change
  });

  const registerWithMask = useHookFormMask(register);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure(); //declaração para uso do hook do modal
  const onSubmitSupabase = async (data: PacFormData) => {
    // Enviar dados para o Supabase
    const { error } = await supabase.from("pacientes").insert([
      {
        pac_name: data.pac_name,
        pac_sex: data.pac_sex,
        pac_whatsapp: data.pac_whatsapp,
        pac_cpf: data.pac_cpf,
        pac_birth_date: data.pac_birth_date,
        pac_email: data.pac_email,
        pac_addrs_street_name: data.pac_addrs_street_name,
        pac_addrs_num: data.pac_addrs_num,
        pac_addrs_city: data.pac_addrs_city,
        pac_addrs_uf: data.pac_addrs_uf,
        pac_addrs_zip: data.pac_addrs_zip,
        pac_addrs_comp: data.pac_addrs_comp,
        pac_has_resp: data.pac_has_resp,
        pac_resp_name: data.pac_resp_name || "",
        pac_resp_email: data.pac_resp_email || "",
        pac_resp_whatsapp: data.pac_resp_whatsapp || "",
        pac_resp_education: data.pac_resp_education || "",
        pac_resp_occupation: data.pac_resp_occupation || "",
        pac_addrs_bairro: data.pac_addrs_bairro || "",
      },
    ]);

    if (error) {
      console.log(error);
      setError(error.message);
    } else {
      console.log(`Paciente Cadastrado com sucesso`);
    }
    onOpen();

    // Exibir o modal independentemente do resultado, com mensagem de sucesso ou erro
    // setModalVisible(true);
  };
  const handleDateChange = (value: DateValue | null) => {
    if (value) {
      const formattedDate = value.toString(); // Convert to string

      setValue("pac_birth_date", formattedDate);
    } else {
      setValue("pac_birth_date", ""); // Clear the value if null
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
        setValue("pac_addrs_street_name", data.logradouro);
        setValue("pac_addrs_bairro", data.bairro);
        setValue("pac_addrs_city", data.localidade);
        setValue("pac_addrs_uf", data.uf);
        setValue("pac_addrs_zip", CEP);
      });
  };

  const values = getValues();
  const hasResp = watch("pac_has_resp", true);

  // Preencher os campos de endereço quando o hook retornar dados

  return (
    <DefaultLayout>
      <form noValidate onSubmit={handleSubmit(onSubmitSupabase)}>
        <div className="flex flex-col gap-4 max-w-[400px] mx-auto">
          <BgCard className="flex flex-col gap-4">
            <Input
              isRequired
              errorMessage={errors.pac_name?.message}
              isInvalid={errors.pac_name ? true : false}
              label="Nome do Paciente"
              labelPlacement="outside"
              placeholder="Digite seu Nome"
              {...register("pac_name")}
            />
            <Controller
              control={control}
              name="pac_sex"
              render={() => (
                <Select
                  isRequired
                  errorMessage={errors.pac_sex?.message}
                  isInvalid={errors.pac_sex ? true : false}
                  label="Sexo"
                  labelPlacement="outside"
                  placeholder="Masculino"
                  {...register("pac_sex")}
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
              name="pac_birth_date"
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
              errorMessage={errors.pac_whatsapp?.message}
              isInvalid={errors.pac_whatsapp ? true : false}
              label="Telefone"
              labelPlacement="outside"
              placeholder="11 12345-6789"
              {...registerWithMask("pac_whatsapp", "99 99999-9999")}
            />
            <Input
              isRequired
              errorMessage={errors.pac_email?.message}
              isInvalid={errors.pac_email ? true : false}
              label="Email"
              labelPlacement="outside"
              placeholder="exemplo@exemplo.com"
              {...register("pac_email")}
            />
            <Input
              errorMessage={errors.pac_cpf?.message}
              isInvalid={errors.pac_cpf ? true : false} // Inverter a condição
              label="CPF"
              labelPlacement="outside"
              placeholder="Digite seu CPF"
              {...registerWithMask("pac_cpf", "cpf")}
            />

            <Controller
              control={control}
              name="pac_addrs_zip"
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  errorMessage={errors.pac_addrs_zip?.message}
                  isInvalid={!!errors.pac_addrs_zip}
                  label="CEP"
                  labelPlacement="outside"
                  placeholder="00000-000"
                  {...registerWithMask("pac_addrs_zip", "99999-999")}
                  onBlur={(e) => {
                    field.onBlur();
                    checkCEP(e as React.FocusEvent<HTMLInputElement>); // Consulta o CEP ao sair do campo
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="pac_addrs_street_name"
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  errorMessage={errors.pac_addrs_street_name?.message}
                  isInvalid={!!errors.pac_addrs_street_name}
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
                name="pac_addrs_bairro"
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    className="w-3/4"
                    errorMessage={errors.pac_addrs_bairro?.message}
                    isInvalid={!!errors.pac_addrs_bairro}
                    label="Bairro"
                    labelPlacement="outside"
                    placeholder="Bela Vista"
                    value={field.value || ""}
                  />
                )}
              />

              <Controller
                control={control}
                name="pac_addrs_num"
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    className="w-1/4"
                    errorMessage={errors.pac_addrs_num?.message}
                    isInvalid={!!errors.pac_addrs_num}
                    label="Número"
                    labelPlacement="outside"
                    placeholder="3012"
                    value={field.value || ""}
                  />
                )}
              />
            </div>
            <div className="flex gap-4 h-max-fit">
              <Controller
                control={control}
                name="pac_addrs_city"
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    className="w-3/4"
                    errorMessage={errors.pac_addrs_city?.message}
                    isInvalid={!!errors.pac_addrs_city}
                    label="Cidade"
                    labelPlacement="outside"
                    placeholder="São Paulo"
                    value={field.value || ""}
                  />
                )}
              />
              <Controller
                control={control}
                name="pac_addrs_uf"
                render={({ field }) => (
                  <Select
                    isRequired
                    className="w-1/4"
                    errorMessage={errors.pac_addrs_uf?.message}
                    isInvalid={!!errors.pac_addrs_uf} // Simplificação da verificação de erro
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
            </div>
            <Controller
              control={control}
              name="pac_addrs_comp"
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={errors.pac_addrs_comp?.message}
                  isInvalid={!!errors.pac_addrs_comp}
                  label="Complemento"
                  labelPlacement="outside"
                  placeholder="Complemento"
                  value={field.value || ""}
                />
              )}
            />
          </BgCard>
          <Spacer />
          <BgCard className="flex flex-col gap-4">
            <Checkbox
              defaultSelected
              onChange={() => {
                setValue("pac_has_resp", !hasResp);
              }}
            >
              Paciente tem responsável
            </Checkbox>

            <Controller
              control={control}
              name="pac_resp_name"
              render={(field) => (
                <Input
                  errorMessage={errors.pac_resp_name?.message}
                  isInvalid={!!errors.pac_resp_name} // Use double negation to ensure boolean type
                  isRequired={hasResp} // Conditionally make the field required based on hasResp
                  label="Nome do Responsável"
                  labelPlacement="outside"
                  placeholder="Emilia Rodrigues"
                  {...field} // This includes value, onChange, onBlur, etc.
                />
              )}
            />

            <Controller
              control={control}
              name="pac_resp_whatsapp"
              render={() => (
                <Input
                  errorMessage={errors.pac_resp_whatsapp?.message}
                  isInvalid={errors.pac_resp_whatsapp ? true : false}
                  isRequired={hasResp} // Torna o campo obrigatório se o checkbox estiver desmarcado
                  label="Telefone do Responsável"
                  labelPlacement="outside"
                  placeholder="11 99999-9999"
                  {...registerWithMask("pac_resp_whatsapp", "99 99999-9999")}
                />
              )}
            />

            <Controller
              control={control}
              name="pac_resp_email"
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={errors.pac_resp_email?.message}
                  isInvalid={!!errors.pac_resp_email ? true : false}
                  isRequired={hasResp} // Torna o campo obrigatório se o checkbox estiver desmarcado
                  label="Email do Responsável"
                  labelPlacement="outside"
                  placeholder="johndean@example.com"
                  type="email"
                />
              )}
            />

            <Controller
              control={control}
              name="pac_resp_occupation"
              render={(field) => (
                <Input
                  {...field}
                  errorMessage={errors.pac_resp_occupation?.message}
                  isInvalid={errors.pac_resp_occupation ? true : false}
                  isRequired={hasResp} // Torna o campo obrigatório se o checkbox estiver desmarcado
                  label="Ocupação do Responsável"
                  labelPlacement="outside"
                  placeholder="Bancário"
                />
              )}
            />
          </BgCard>
          <Button className="mx-auto" color="primary" type="submit">
            Enviar
          </Button>{" "}
          <pre>{JSON.stringify(values, null, 2)}</pre>
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
