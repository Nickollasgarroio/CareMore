/* eslint-disable no-console */
import { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

import { UserProfile } from "@/types/FormDataTypes";

interface CitySelectProps {
  uf: string;
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
}

export function CitySelect({ uf, register, errors }: CitySelectProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uf) return; // Não fazer nada se o UF não estiver selecionado.

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
    <>
      <Autocomplete
        isRequired
        errorMessage={errors.city?.message || error}
        isInvalid={!!errors.city || !!error}
        label="Cidade"
        labelPlacement="outside"
        placeholder={loading ? "Carregando..." : "Selecione uma cidade"}
        {...register("city")}
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
    </>
  );
}
