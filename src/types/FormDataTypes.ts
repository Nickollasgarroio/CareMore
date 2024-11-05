// types/pacDataTypes.ts

export type PacFormData = {
  pac_id?: string;
  pac_name: string;
  pac_sex: "Masculino" | "Feminino" | "Não Binário" | "Não informado";
  pac_whatsapp: string;
  pac_cpf?: string;
  pac_birth_date: string;
  pac_email?: string;
  pac_addrs_street_name: string;
  pac_addrs_num: string;
  pac_addrs_bairro: string;
  pac_addrs_city: string;
  pac_addrs_uf: string;
  pac_addrs_zip: string;
  pac_addrs_comp?: string;
  pac_has_resp?: boolean;
  pac_resp_name?: string;
  pac_resp_email?: string;
  pac_resp_whatsapp?: string;
  pac_resp_education?: string;
  pac_resp_occupation?: string;
};

export type UserSignUpFormData = {
  id?: string;
  name?: string;
  email: string;
  email_confirmation: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  birth_date?: string;
  role?: "admin" | "user";
  especialidade?: string;
};
export type UserLoginData = {
  email: string;
  password: string;
};
