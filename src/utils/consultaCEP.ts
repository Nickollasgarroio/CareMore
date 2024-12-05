/* eslint-disable no-console */

export const checkCEP = (zip: string) => {
  const CEP = zip.replace(/\D/g, "");

  fetch(`https://viacep.com.br/ws/${CEP}/json`, {})
    .then((response) => response.json())
    .then((data) => {
      console.log("CEP consultado com sucesso", data);

      return {
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
        cep: CEP,
      };
    });
};
