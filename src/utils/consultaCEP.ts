
const checkCEP = (event: React.FocusEvent<HTMLInputElement> | FocusEvent) => {
  const inputEvent = event as React.FocusEvent<HTMLInputElement>;
  const CEP = inputEvent.target.value.replace(/\D/g, "");

  fetch(`https://viacep.com.br/ws/${CEP}/json`, {})
    .then((response) => response.json())
    .then((data) => {
      console.log("CEP consultado com sucesso", data);
      return data;
    });
};

export default checkCEP