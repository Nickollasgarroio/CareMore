/* eslint-disable prettier/prettier */

// Função para formatar o CPF no padrão XXX.XXX.XXX-XX
export const formatCPF = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "").slice(0, 11); // Limita a 11 dígitos
  return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

// Função para validar o CPF
export const isValidCPF = (cpf: string | undefined): boolean => {
  if (!cpf) return false; // Verifica se o CPF é undefined ou vazio
  cpf = cpf.replace(/\D/g, ""); // Remove non-numeric characters
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // Invalid length or repeated digits

  const calcCheckDigit = (factor: number): number =>
    ((cpf
      .slice(0, factor - 1)
      .split("")
      .reduce(
        (sum, digit, index) => sum + Number(digit) * (factor - index),
        0
      ) *
      10) %
      11) %
    10;

  if (calcCheckDigit(10) !== Number(cpf[9])) return false; // Validate 1st check digit
  if (calcCheckDigit(11) !== Number(cpf[10])) return false; // Validate 2nd check digit

  return true;
};
