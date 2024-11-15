import {
  DatePicker,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import {
  UseFormRegister,
  FieldErrors,
  Controller,
  Control,
  WatchObserver,
  WatchInternal,
} from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { useState } from "react";

import { UserProfile } from "@/types/FormDataTypes";
import {
  estadosUF,
  generos,
  especialidades,
  titulosProfissionais,
  publico_preferencial,
  modalidade_atendimento,
} from "@/config/cadastroConfigs";
import { CitySelect } from "@/components/ProfileForm/citySelect";

interface PersonalInfoStepProps {
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
  control: Control<UserProfile>;
}

export function PersonalInfoStep({
  control,
  register,
  errors,
}: PersonalInfoStepProps) {
  const registerWithMask = useHookFormMask(register);

  return (
    <>
      <Input
        isRequired
        errorMessage={errors.name?.message}
        isInvalid={!!errors.name}
        label="Nome Completo"
        labelPlacement="outside"
        placeholder="Júlia"
        type="string"
        {...register("name")}
      />
      <Input
        isRequired
        errorMessage={errors.name?.message}
        isInvalid={!!errors.name}
        label="Sobrenome"
        labelPlacement="outside"
        placeholder="Alves"
        type="string"
        {...register("last_name")}
      />
      <Select
        isRequired
        errorMessage={errors.sex?.message}
        isInvalid={!!errors.sex}
        label="Sexo"
        labelPlacement="outside"
        placeholder="Feminino"
        {...register("sex")}
      >
        {generos.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </Select>
      <Controller
        control={control}
        name="birth_date"
        render={({ field }) => (
          <DatePicker
            isRequired
            label="Data de Nascimento"
            labelPlacement="outside"
            maxValue={today(getLocalTimeZone())}
            value={field.value ? parseDate(field.value) : null} // Valor controlado
            onChange={(date) => field.onChange(date?.toString() || "")}
          />
        )}
      />
      <Input
        isRequired
        errorMessage={errors.phone?.message}
        isInvalid={!!errors.phone}
        label="Telefone"
        labelPlacement="outside"
        placeholder="11 99999-9999"
        type="string"
        {...registerWithMask("phone", "99 99999-9999")}
      />
    </>
  );
}

interface LocalidadeInfoStepProps {
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
  watch: WatchInternal<UserProfile>;
}
export function LocalidadeInfoStep({
  register,
  errors,
  watch,
}: LocalidadeInfoStepProps) {
  // const [uf, setUf] = useState<string>("");
  const uf = watch("uf");

  return (
    <>
      <Select
        isRequired
        label="UF"
        labelPlacement="outside"
        placeholder="Selecione o estado"
        {...register("uf")}
        // onChange={(e) => setUf(e.target.value)} // Atualiza o UF selecionado
      >
        {estadosUF.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </Select>
      <CitySelect errors={errors} register={register} uf={uf} />
    </>
  );
}

interface ProfessionalInfoStepProps {
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
}

export function ProfessionalInfoStep({
  register,
  errors,
}: ProfessionalInfoStepProps) {
  // Campos relacionados a dados profissionais, adicionar aqui

  return (
    <>
      <Select
        isRequired
        errorMessage={errors.area_de_atuacao?.message}
        isInvalid={!!errors.area_de_atuacao}
        label="Especialidade"
        labelPlacement="outside"
        placeholder="Fonoaudiologia"
        {...register("area_de_atuacao")}
      >
        {especialidades.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </Select>
      <Select
        isRequired
        errorMessage={errors.title?.message}
        isInvalid={!!errors.title}
        label="Títulos"
        labelPlacement="outside"
        placeholder="Dr."
        {...register("title")}
      >
        {titulosProfissionais.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </Select>
      <Select
        isRequired
        defaultSelectedKeys={["Todos"]}
        errorMessage={errors.publico_preferencial?.message}
        isInvalid={!!errors.publico_preferencial}
        label="Público Preferencial"
        labelPlacement="outside"
        placeholder="Todos"
        {...register("publico_preferencial")}
      >
        {publico_preferencial.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </Select>
      <Select
        isRequired
        defaultSelectedKeys={["Todos"]}
        errorMessage={errors.modalidade_atendimento?.message}
        isInvalid={!!errors.modalidade_atendimento}
        label="Modalidade de Atendimento"
        labelPlacement="outside"
        placeholder="Todos"
        {...register("modalidade_atendimento")}
      >
        {modalidade_atendimento.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </Select>
      <Divider />
      <Input
        label="Bio"
        labelPlacement="outside"
        maxLength={50}
        placeholder="Se apresente em um pequeno texto!"
        {...register("bio")}
      />
      <Textarea
        errorMessage={errors.about_me?.message}
        isInvalid={!!errors.about_me}
        label="Sobre Mim"
        labelPlacement="outside"
        maxLength={500}
        maxRows={10}
        placeholder="Conte um pouco mais sobre você!"
        {...register("about_me")}
      />
    </>
  );
}

interface ContactInfoStepProps {
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
}
export function ContactInfoStep({ register, errors }: ContactInfoStepProps) {
  const registerWithMask = useHookFormMask(register);

  return (
    <>
      <Input
        errorMessage={errors.instagram?.message}
        isInvalid={!!errors.instagram}
        label="Instagram"
        labelPlacement="outside"
        placeholder="@juliaalves"
        type="string"
        {...register("instagram")}
      />
      <Input
        errorMessage={errors.tiktok?.message}
        isInvalid={!!errors.tiktok}
        label="Tik Tok"
        labelPlacement="outside"
        placeholder="@juliaalves"
        type="string"
        {...register("tiktok")}
      />
      <Input
        errorMessage={errors.instagram?.message}
        isInvalid={!!errors.instagram}
        label="Email Contato"
        labelPlacement="outside"
        placeholder="@juliaalves"
        type="email"
        {...register("contato_email")}
      />
      <Input
        errorMessage={errors.instagram?.message}
        isInvalid={!!errors.instagram}
        label="WhatsApp"
        labelPlacement="outside"
        placeholder="11 99999-9999"
        type="string"
        {...registerWithMask("contato_whatsapp", "99 99999-9999")}
      />
    </>
  );
}
