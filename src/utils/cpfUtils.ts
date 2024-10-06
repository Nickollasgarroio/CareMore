/* eslint-disable prettier/prettier */

// Função para formatar o CPF no padrão XXX.XXX.XXX-XX
export const formatCPF = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "").slice(0, 11); // Limita a 11 dígitos
  return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

// Função para validar o CPF
export const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

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

  return calcCheckDigit(10) === +cpf[9] && calcCheckDigit(11) === +cpf[10];
};
