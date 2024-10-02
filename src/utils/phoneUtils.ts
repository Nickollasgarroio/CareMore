/* eslint-disable prettier/prettier */
// Função para formatar o telefone no padrão brasileiro +55 (XX) XXXXX-XXXX
export const formatPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "").slice(0, 11); // Limita o telefone a 11 dígitos

  return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, "+55 ($1) $2-$3");
};

// Função para validar o telefone no formato brasileiro
export const isValidPhone = (phone: string): boolean => {
  return /^\+55\s?\(\d{2}\)\s?\d{5}-\d{4}$/.test(phone);
};
