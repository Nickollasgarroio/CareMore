import { useState, useEffect } from 'react';

interface Endereco {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export const useCEPFinder = (cep: string) => {
  const [endereco, setEndereco] = useState<Endereco | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (cep.length === 8) { // Apenas faz a requisição se o CEP tiver 8 dígitos
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.erro) {
            setEndereco({
              logradouro: data.logradouro,
              bairro: data.bairro,
              localidade: data.localidade,
              uf: data.uf,
            });
            setErro(false);
          } else {
            setErro(true);
            setEndereco(null);
          }
        })
        .catch(() => {
          setErro(true);
          setEndereco(null);
        });
    } else {
      setEndereco(null);
      setErro(false);
    }
  }, [cep]);

  return { endereco, erro };
};
