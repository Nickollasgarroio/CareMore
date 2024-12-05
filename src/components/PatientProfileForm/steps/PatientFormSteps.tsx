/* eslint-disable no-console */
import { DatePicker, Input, Select, SelectItem } from "@nextui-org/react";
import {
  UseFormRegister,
  FieldErrors,
  Controller,
  Control,
  UseFormSetValue,
  WatchInternal,
} from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";

import { PacFormData } from "@/types/FormDataTypes";
import { estadosUF, generos } from "@/config/cadastroConfigs";
import { CitySelect } from "@/components/ProfileForm/citySelect";
import { calculateAge } from "@/utils/calculateAge";

interface PersonalInfoStepProps {
  register: UseFormRegister<PacFormData>;
  errors: FieldErrors<PacFormData>;
  control: Control<PacFormData>;
  isEditing?: boolean;
}
export function PersonalInfoStep({
  control,
  register,
  errors,
  isEditing,
}: PersonalInfoStepProps) {
  const registerWithMask = useHookFormMask(register);

  return (
    <>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            isRequired
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name}
            isReadOnly={isEditing}
            label="Nome Completo"
            labelPlacement="outside"
            placeholder="Júlia"
            value={field.value}
            {...register("name")}
          />
        )}
      />
      <div className="flex flex-col gap-4 sm:flex-row">
        <Controller
          control={control}
          name="sex"
          render={({ field }) => (
            <Select
              isRequired
              errorMessage={errors.sex?.message}
              isDisabled={!isEditing}
              isInvalid={!!errors.sex}
              label="Sexo"
              labelPlacement="outside"
              placeholder="Feminino"
              selectedKeys={field.value ? new Set([field.value]) : new Set()}
              onSelectionChange={(value) => field.onChange(value.currentKey)}
              {...register("sex")}
            >
              {generos.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          control={control}
          name="birth_date"
          render={({ field }) => (
            <DatePicker
              isRequired
              className="sm:w-fit"
              isDisabled={!isEditing}
              label="Data de Nascimento"
              labelPlacement="outside"
              maxValue={today(getLocalTimeZone())}
              value={field.value ? parseDate(field.value) : null}
              {...register("birth_date")}
              onChange={(date) => field.onChange(date?.toString() || "")}
            />
          )}
        />
        <Controller
          control={control}
          name="birth_date"
          render={({ field }) => (
            <Input
              className="sm:max-w-[50px]"
              isReadOnly={isEditing}
              label="Idade"
              labelPlacement="outside"
              value={calculateAge(field.value).toString()}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="cpf"
        render={({ field }) => (
          <Input
            isRequired
            errorMessage={errors.cpf?.message}
            isInvalid={!!errors.cpf}
            isReadOnly={isEditing}
            label="CPF"
            labelPlacement="outside"
            placeholder="123.456.789-00"
            value={field.value}
            {...registerWithMask("cpf", "999.999.999-99")}
          />
        )}
      />
    </>
  );
}
// Localidade Info
interface LocalidadeInfoStepProps {
  register: UseFormRegister<PacFormData>;
  errors: FieldErrors<PacFormData>;
  watch: WatchInternal<PacFormData>;
  control: Control<PacFormData>;
  setValue: UseFormSetValue<PacFormData>;
  readOnly?: boolean;
}
export function LocalidadeInfoStep({
  readOnly,
  register,
  errors,
  watch,
  control,
  setValue,
}: LocalidadeInfoStepProps) {
  const uf = watch("addrs_uf");

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

  return (
    <>
      <Controller
        control={control}
        name="addrs_zip"
        render={({ field }) => (
          <Input
            isRequired
            errorMessage={errors.addrs_street_name?.message?.toString()}
            isInvalid={!!errors.addrs_street_name}
            isReadOnly={!readOnly}
            label="CEP"
            labelPlacement="outside"
            placeholder="12345-678"
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
            isRequired
            errorMessage={errors.addrs_street_name?.message?.toString()}
            isInvalid={!!errors.addrs_street_name}
            isReadOnly={!readOnly}
            label="Rua"
            labelPlacement="outside"
            placeholder="Av. Paulista"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="addrs_num"
        render={({ field }) => (
          <Input
            isRequired
            errorMessage={errors.addrs_num?.message?.toString()}
            isInvalid={!!errors.addrs_num}
            isReadOnly={!readOnly}
            label="Número"
            labelPlacement="outside"
            placeholder="1020"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="addrs_bairro"
        render={({ field }) => (
          <Input
            isRequired
            errorMessage={errors.addrs_bairro?.message?.toString()}
            isInvalid={!!errors.addrs_bairro}
            isReadOnly={!readOnly}
            label="Bairro"
            labelPlacement="outside"
            placeholder="Bela Vista"
            {...field}
          />
        )}
      />
      <Select
        isRequired
        isDisabled={!readOnly}
        label="UF"
        labelPlacement="outside"
        placeholder="Selecione o estado"
        {...register("addrs_uf")}
      >
        {estadosUF.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </Select>

      <Controller
        control={control}
        name="addrs_city"
        render={({ field }) => (
          <CitySelect
            readonly={!readOnly}
            name="addrs_city"
            control={control}
            errors={errors}
            setValue={setValue}
            uf={uf}
          />
        )}
      />
    </>
  );
}
// Contact Info
interface ContactInfoStepProps {
  register: UseFormRegister<PacFormData>;
  errors: FieldErrors<PacFormData>;
  control: Control<PacFormData>;
  readOnly?: boolean;
}
export function ContactInfoStep({
  control,
  errors,
  register,
  readOnly,
}: ContactInfoStepProps) {
  const registerWithMask = useHookFormMask(register);

  return (
    <>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            isRequired
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            isReadOnly={!readOnly}
            label="Email Contato"
            labelPlacement="outside"
            placeholder="julia.profissional@teste.com"
            type="email"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="whatsapp"
        render={({ field }) => (
          <Input
            isRequired
            errorMessage={errors.whatsapp?.message}
            isInvalid={!!errors.whatsapp}
            isReadOnly={!readOnly}
            label="WhatsApp"
            labelPlacement="outside"
            placeholder="11 99999-9999"
            {...registerWithMask("whatsapp", "99 99999-9999")}
            onChange={(e) => field.onChange(e.target.value || "")}
          />
        )}
      />
    </>
  );
}
// Responsável Info
interface ResponsavelInfoStepProps {
  register: UseFormRegister<PacFormData>;
  errors: FieldErrors<PacFormData>;
  control: Control<PacFormData>;
  hasResp: boolean;
  isEditing?: boolean;
}
export function ResponsavelInfoStepProps({
  control,
  errors,
  register,
  hasResp,
  isEditing,
}: ResponsavelInfoStepProps) {
  const registerWithMask = useHookFormMask(register);

  return (
    <>
      <Controller
        control={control}
        name="resp_name"
        render={({ field }) => (
          <Input
            errorMessage={errors.resp_name?.message}
            readOnly={isEditing}
            isInvalid={!!errors.resp_name}
            isReadOnly={isEditing}
            isRequired={!hasResp}
            label="Nome Completo"
            labelPlacement="outside"
            placeholder="Nicolas Silva"
            value={field.value || ""}
            {...register("resp_name")}
          />
        )}
      />
      <Controller
        control={control}
        name="resp_occupation"
        render={({ field }) => (
          <Input
            errorMessage={errors.resp_occupation?.message}
            isInvalid={!!errors.resp_occupation}
            isReadOnly={isEditing}
            isRequired={!hasResp}
            label="Ocupação"
            labelPlacement="outside"
            placeholder="Programador"
            value={field.value || ""}
            {...register("resp_occupation")}
          />
        )}
      />
      <Controller
        control={control}
        name="resp_education"
        render={({ field }) => (
          <Input
            errorMessage={errors.resp_education?.message}
            isInvalid={!!errors.resp_education}
            isReadOnly={isEditing}
            isRequired={!hasResp}
            label="Escolaridade"
            labelPlacement="outside"
            placeholder="Superior Completo"
            value={field.value || ""}
            {...register("resp_education")}
          />
        )}
      />
      <Controller
        control={control}
        name="resp_email"
        render={({ field }) => (
          <Input
            errorMessage={errors.resp_email?.message}
            isInvalid={!!errors.email}
            isReadOnly={isEditing}
            isRequired={!hasResp}
            label="Email Contato"
            labelPlacement="outside"
            placeholder="julia.profissional@teste.com"
            type="email"
            value={field.value || ""}
            {...register("resp_email")}
          />
        )}
      />
      <Controller
        control={control}
        name="resp_whatsapp"
        render={({ field }) => (
          <Input
            errorMessage={errors.resp_whatsapp?.message}
            isInvalid={!!errors.resp_whatsapp}
            isReadOnly={isEditing}
            isRequired={!hasResp}
            label="Telefone"
            labelPlacement="outside"
            placeholder="11 99999-9999"
            value={field.value || ""}
            {...registerWithMask("resp_whatsapp", "99 99999-9999")}
            onChange={(e) => field.onChange(e.target.value || "")}
          />
        )}
      />
    </>
  );
}
