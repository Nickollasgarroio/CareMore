import React from "react";
import {
  Button,
  Select,
  SelectItem,
  DatePicker,
  Spacer,
  Checkbox,
} from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateValue } from "@internationalized/date";
import { useHookFormMask } from "use-mask-input";

import FormData from "@/types/FormDataTypes";
import { estadosUF, generos } from "@/pages/configs/cadastroConfigs";
import formSchema from "@/schemas/formSchemas";
import { supabase } from "@/supabaseClient";
import { BgCard } from "@/components/bg-card";
import DefaultLayout from "@/layouts/default";

export default function CadastroPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    getValues, // Import this function
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pac_has_resp: true,
      pac_addrs_has_comp: false,
    },
    mode: "onChange", // This ensures validation runs on every change
  });

  const registerWithMask = useHookFormMask(register);

  const onSubmitSupabase = async (data: FormData) => {
    // Enviar dados para o Supabase
    const { error } = await supabase
      .from("pacientes") // Nome do formSchema
      .insert([
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
          pac_addrs_has_comp: data.pac_addrs_has_comp,
          pac_addrs_comp: data.pac_addrs_comp,
          pac_has_resp: data.pac_has_resp,
          pac_resp_name: data.pac_resp_name,
          pac_resp_email: data.pac_resp_email,
          pac_resp_whatsapp: data.pac_resp_whatsapp,
          pac_resp_education: data.pac_resp_education,
          pac_resp_occupation: data.pac_resp_occupation,
          pac_addrs_bairro: data.pac_addrs_bairro,
        },
      ]);

    if (error) {
      // console.error("Erro ao inserir dados:", error.message);
      alert("Erro ao inserir dados: " + error.message);
    } else {
      alert("Dados enviados com sucesso!");
    }
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
        // console.log("CEP consultado com sucesso", data);
        setValue("pac_addrs_street_name", data.logradouro);
        setValue("pac_addrs_bairro", data.bairro);
        setValue("pac_addrs_city", data.localidade);
        setValue("pac_addrs_uf", data.uf);
        setValue("pac_addrs_zip", CEP);
      });
  };

  const values = getValues();

  // Preencher os campos de endereço quando o hook retornar dados

  return (
    <DefaultLayout>
      <form onSubmit={handleSubmit(onSubmitSupabase)}>
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
              render={({}) => (
                <Input
                  isRequired
                  errorMessage={errors.pac_addrs_zip?.message}
                  isInvalid={!!errors.pac_addrs_zip}
                  label="CEP"
                  labelPlacement="outside"
                  placeholder="00000-000"
                  {...registerWithMask("pac_addrs_zip", "99999-999", {
                    required: "Este campo é obrigatório",
                  })}
                  onBlur={(e) =>
                    checkCEP(e as React.FocusEvent<HTMLInputElement>)
                  }
                />
              )}
            />

            <Input
              isRequired
              className=""
              errorMessage={errors.pac_addrs_street_name?.message}
              isInvalid={errors.pac_addrs_street_name ? true : false}
              label="Endereço"
              labelPlacement="outside"
              placeholder="Av. Paulista"
              value={values.pac_addrs_street_name}
              {...register("pac_addrs_street_name")}
            />
            <div className="flex gap-4">
              <Input
                isRequired
                className="w-3/4"
                errorMessage={errors.pac_addrs_bairro?.message}
                isInvalid={errors.pac_addrs_bairro ? true : false}
                label="Bairro"
                labelPlacement="outside"
                placeholder="Bela Vista"
                value={values.pac_addrs_bairro}
                {...register("pac_addrs_bairro")}
              />

              <Input
                isRequired
                className="w-1/4"
                errorMessage={errors.pac_addrs_num?.message}
                isInvalid={errors.pac_addrs_num ? true : false}
                label="Número"
                labelPlacement="outside"
                placeholder="304"
                {...register("pac_addrs_num")}
              />
            </div>
            <div className="flex gap-4 h-max-fit">
              <Input
                isRequired
                className="w-3/4"
                errorMessage={errors.pac_addrs_city?.message}
                isInvalid={errors.pac_addrs_city ? true : false}
                label="Cidade"
                labelPlacement="outside"
                placeholder="São Paulo"
                value={values.pac_addrs_city}
                {...register("pac_addrs_city")}
              />
              <Controller
                control={control}
                name="pac_addrs_uf"
                render={({ field: { value } }) => (
                  <Select
                    isRequired
                    className="w-1/4"
                    errorMessage={errors.pac_addrs_uf?.message}
                    isInvalid={errors.pac_addrs_uf ? true : false}
                    label="Estado"
                    labelPlacement="outside"
                    placeholder="SP"
                    selectedKeys={value ? [value] : []} // Corrige a seleção do item atual
                    value={values.pac_addrs_uf}
                    {...register("pac_addrs_uf")}
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
              name="pac_addrs_has_comp"
              render={() => (
                <Input
                  errorMessage={errors.pac_addrs_comp?.message}
                  isInvalid={errors.pac_addrs_comp ? true : false}
                  // isRequired={
                  //   control._formValues.pac_addrs_has_comp ? false : true
                  // }
                  label="Complemento"
                  labelPlacement="outside"
                  placeholder="Apartamento 204"
                  value={values.pac_addrs_comp}
                  {...register("pac_addrs_comp")}
                />
              )}
            />
            {/* <Controller
              control={control}
              name="pac_addrs_has_comp"
              render={({ field }) => (
                <Checkbox
                  isSelected={field.value}
                  size="sm"
                  onChange={() => field.onChange(!field.value)} // Inverte o valor atual
                >
                  Endereço não tem Complemento
                </Checkbox>
              )}
            /> */}
          </BgCard>
          <Spacer />
          <BgCard className="flex flex-col gap-4">
            <Controller
              control={control}
              name="pac_has_resp"
              render={({ field }) => (
                <Checkbox
                  defaultChecked={values.pac_has_resp}
                  size="sm"
                  onChange={() => field.onChange(!field.value)} // Inverte o valor atual
                >
                  Paciente não tem Responsável
                </Checkbox>
              )}
            />

            <Controller
              control={control}
              name="pac_resp_name"
              render={() => (
                <Input
                  errorMessage={errors.pac_resp_name?.message}
                  isInvalid={errors.pac_resp_name ? true : false}
                  isRequired={values.pac_has_resp} // Torna o campo obrigatório se o checkbox estiver desmarcado
                  label="Nome do Responsável"
                  labelPlacement="outside"
                  placeholder="Emilia Rodrigues"
                  {...register("pac_resp_name")}
                />
              )}
            />

            {/* Repita para os outros campos de responsável */}
            <Controller
              control={control}
              name="pac_resp_whatsapp"
              render={() => (
                <Input
                  errorMessage={errors.pac_resp_whatsapp?.message}
                  isInvalid={errors.pac_resp_whatsapp ? true : false}
                  isRequired={values.pac_has_resp} // Torna o campo obrigatório se o checkbox estiver desmarcado
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
              render={() => (
                <Input
                  errorMessage={errors.pac_resp_email?.message}
                  isInvalid={!!errors.pac_resp_email ? true : false}
                  isRequired={values.pac_has_resp} // Torna o campo obrigatório se o checkbox estiver desmarcado
                  label="Email do Responsável"
                  labelPlacement="outside"
                  placeholder="johndean@example.com"
                  type="email"
                  {...register("pac_resp_email")}
                />
              )}
            />

            <Controller
              control={control}
              name="pac_resp_occupation"
              render={() => (
                <Input
                  errorMessage={errors.pac_resp_occupation?.message}
                  isInvalid={errors.pac_resp_occupation ? true : false}
                  isRequired={values.pac_has_resp} // Torna o campo obrigatório se o checkbox estiver desmarcado
                  label="Ocupação do Responsável"
                  labelPlacement="outside"
                  placeholder="Bancário"
                  {...register("pac_resp_occupation")}
                />
              )}
            />
          </BgCard>
          <Button className="mx-auto" color="primary" type="submit">
            Enviar
          </Button>
        </div>
        <div> {/* <pre>{JSON.stringify(watchedForm, null, 2)}</pre> */}</div>
        {/* {Object.keys(errors).length > 0 && (
          <div className="error-messages">
            <h4>Por favor, corrija os seguintes erros:</h4>
            <ul>
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
          </div>
        )} */}
      </form>
    </DefaultLayout>
  );
}
