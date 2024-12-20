import { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import {
  Controller,
  FieldErrors,
  Control,
  UseFormSetValue,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

interface CitySelectProps<T extends FieldValues> {
  uf: string;
  readonly?: boolean;
  control: Control<T>;
  errors: FieldErrors<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>; // Alterado para Path<T>
  label?: string; // Personalizar o rótulo
}

export function CitySelect<T extends FieldValues>({
  uf,
  control,
  errors,
  setValue,
  name,
  readonly,
  label = "Cidade",
}: CitySelectProps<T>) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uf) return;

    const fetchCities = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf.toLowerCase()}/municipios`
        );
        const data = await response.json();
        const cityList = data.map(
          (municipio: { nome: string }) => municipio.nome
        );

        setCities(cityList);
      } catch (err) {
        setError("Erro ao carregar as cidades");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [uf]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Autocomplete
          isRequired
          isReadOnly={readonly}
          errorMessage={errors[name]?.message?.toString() || error}
          isClearable={false}
          isInvalid={!!errors[name] || !!error}
          label={label}
          labelPlacement="outside"
          placeholder={loading ? "Carregando..." : "Selecione uma cidade"}
          defaultSelectedKey={field.value}
          selectedKey={field.value}
          onSelectionChange={(value) => {
            setValue(name, value as PathValue<T, Path<T>>, {
              shouldValidate: true,
            });
          }}
        >
          {!loading && cities.length > 0 ? (
            cities.map((city) => (
              <AutocompleteItem key={city} value={city}>
                {city}
              </AutocompleteItem>
            ))
          ) : (
            <AutocompleteItem key={"empty"} value={""}>
              Nenhuma cidade disponível
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  );
}
