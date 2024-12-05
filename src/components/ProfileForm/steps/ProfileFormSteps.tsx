import {
  DatePicker,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import {
  UseFormRegister,
  FieldErrors,
  Controller,
  Control,
  WatchInternal,
  UseFormSetValue,
} from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";

import { UserProfile } from "@/types/FormDataTypes";
import {
  estadosUF,
  generos,
  especialidades,
  titulosProfissionais,
  modalidade_atendimento,
  publico_preferencial,
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
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            isRequired
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name}
            label="Nome Completo"
            labelPlacement="outside"
            placeholder="Júlia"
            {...field} // Uso do campo controlado
          />
        )}
      />

      <Controller
        control={control}
        name="last_name"
        render={({ field }) => (
          <Input
            isRequired
            errorMessage={errors.last_name?.message}
            isInvalid={!!errors.last_name}
            label="Sobrenome"
            labelPlacement="outside"
            placeholder="Alves"
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="sex"
        render={({ field }) => (
          <Select
            isRequired
            errorMessage={errors.sex?.message}
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
            label="Data de Nascimento"
            labelPlacement="outside"
            maxValue={today(getLocalTimeZone())}
            value={field.value ? parseDate(field.value) : null}
            onChange={(date) => field.onChange(date?.toString() || "")}
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <Input
            isRequired
            description="Esse telefone não será exibido no perfil"
            errorMessage={errors.phone?.message}
            isInvalid={!!errors.phone}
            label="Telefone"
            labelPlacement="outside"
            placeholder="11 99999-9999"
            {...field}
            {...registerWithMask("phone", "99 99999-9999")}
          />
        )}
      />
    </>
  );
}
interface LocalidadeInfoStepProps {
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
  watch: WatchInternal<UserProfile>;
  control: Control<UserProfile>;
  setValue: UseFormSetValue<UserProfile>;
}
export function LocalidadeInfoStep({
  control,
  errors,
  watch,
  register,
  setValue,
}: LocalidadeInfoStepProps) {
  const uf = watch("uf");

  return (
    <>
      <Select
        isRequired
        label="UF"
        labelPlacement="outside"
        placeholder="Selecione o estado"
        {...register("uf")}
      >
        {estadosUF.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </Select>

      <CitySelect
        name="city"
        control={control}
        errors={errors}
        setValue={setValue}
        uf={uf}
      />
    </>
  );
}

interface ProfessionalInfoStepProps {
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
  control: Control<UserProfile>;
}

export function ProfessionalInfoStep({
  control,
  errors,
  register,
}: ProfessionalInfoStepProps) {
  return (
    <>
      <Controller
        control={control}
        name="area_de_atuacao"
        render={({}) => (
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
        )}
      />

      <Controller
        control={control}
        name="title"
        render={({}) => (
          <Select
            isRequired
            defaultSelectedKeys={["Nenhum"]}
            description="Selecione o seu título profissional"
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
        )}
      />

      <Controller
        control={control}
        name="modalidade_atendimento"
        render={({}) => (
          <Select
            isRequired
            defaultSelectedKeys={["Todos"]}
            description="Selecione qual modalidade de atendimento deseja oferecer"
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
        )}
      />
      <Controller
        control={control}
        name="publico_preferencial"
        render={({}) => (
          <Select
            isRequired
            defaultSelectedKeys={["Todos"]}
            description="Selecione qual público deseja oferecer"
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
        )}
      />
      <Divider />

      <Controller
        control={control}
        name="bio"
        render={({ field }) => (
          <Input
            description="Faça um resumo sobre você"
            errorMessage={errors.bio?.message}
            isInvalid={!!errors.bio}
            label="Bio"
            labelPlacement="outside"
            maxLength={50}
            placeholder="Todos"
            {...register("bio")}
            onChange={(e) => field.onChange(e.target.value || "")}
          />
        )}
      />
      <Controller
        control={control}
        name="about_me"
        render={({ field }) => (
          <Textarea
            description="Fale mais sobre você"
            errorMessage={errors.about_me?.message}
            isInvalid={!!errors.about_me}
            label="Sobre Mim"
            labelPlacement="outside"
            maxLength={500}
            maxRows={10}
            minRows={5}
            placeholder="Todos"
            {...register("about_me")}
            onChange={(e) => field.onChange(e.target.value || "")}
          />
        )}
      />

      {/* Adicione o restante dos campos de forma similar */}
    </>
  );
}

interface ContactInfoStepProps {
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
  control: Control<UserProfile>;
}
export function ContactInfoStep({
  control,
  errors,
  register,
}: ContactInfoStepProps) {
  const registerWithMask = useHookFormMask(register);

  return (
    <>
      <Controller
        control={control}
        name="contato_email"
        render={({ field }) => (
          <Input
            description="Esse dado será exibido no seu perfil profissional"
            errorMessage={errors.contato_email?.message}
            isInvalid={!!errors.contato_email}
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
        name="contato_whatsapp"
        render={({ field }) => (
          <Input
            errorMessage={errors.contato_whatsapp?.message}
            isInvalid={!!errors.contato_whatsapp}
            description="Esse dado será exibido no seu perfil profissional"
            label="WhatsApp"
            labelPlacement="outside"
            placeholder="11 99999-9999"
            {...registerWithMask("contato_whatsapp", "99 99999-9999")}
            onChange={(e) => field.onChange(e.target.value || "")}
          />
        )}
      />
      <Divider />
      <p className="text-xs text-foreground-400 mx-auto">Redes Sociais</p>
      <Controller
        control={control}
        name="instagram"
        render={({ field }) => (
          <Input
            errorMessage={errors.instagram?.message}
            isInvalid={!!errors.instagram}
            label="Instagram"
            labelPlacement="outside"
            placeholder="@juliaalves"
            type="string"
            {...field}
            onChange={(e) => field.onChange(e.target.value || "")}
          />
        )}
      />

      <Controller
        control={control}
        name="tiktok"
        render={({ field }) => (
          <Input
            errorMessage={errors.tiktok?.message}
            isInvalid={!!errors.tiktok}
            label="Tik Tok"
            labelPlacement="outside"
            placeholder="@juliaalves"
            type="string"
            {...field}
            onChange={(e) => field.onChange(e.target.value || "")}
          />
        )}
      />
    </>
  );
}
