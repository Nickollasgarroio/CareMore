/* eslint-disable prettier/prettier */

export const formatZipCode = (value: string): string => {
  const onlyDigits = value.replace(/\D/g, "");

  if (onlyDigits.length <= 5) return onlyDigits;
  if (onlyDigits.length <= 8) {
    return `${onlyDigits.slice(0, 5)}-${onlyDigits.slice(5)}`;
  }

  return `${onlyDigits.slice(0, 5)}-${onlyDigits.slice(5, 8)}`;
};

// Função para validar o CEP
export const isValidZipCode = (value: string): boolean => {
  // Verifica se o CEP está no formato XXXXX-XXX
  const zipCodeRegex = /^\d{5}-\d{3}$/;

  return zipCodeRegex.test(value);
};
