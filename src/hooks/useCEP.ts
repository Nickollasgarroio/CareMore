import { useState } from "react";
import axios from "axios";

export const useCEPFinder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findAddressByCEP = async (cep: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      setLoading(false);

      return response.data;
    } catch (err) {
      setError("Erro ao buscar CEP");
      setLoading(false);

      return null;
    }
  };

  return { findAddressByCEP, loading, error };
};
