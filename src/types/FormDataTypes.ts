// types/pacDataTypes.ts

export type PacFormData = {
  pac_id?: string;
  pac_name: string;
  pac_sex: string;
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
  email: string;
  email_confirmation: string;
  password: string;
  password_confirmation: string;
  role?: "admin" | "user";
};
export type UserProfile = {
  name: string;
  last_name: string;
  sex: string;
  phone: string;
  birth_date: string;
  city: string;
  uf?: string;
  bio?: string;
  about_me?: string;
  area_de_atuacao: string;
  publico_preferencial: string;
  title: string;
  instagram?: string;
  tiktok?: string;
  contato_email?: string;
  contato_whatsapp?: string;
  modalidade_atendimento:string;
};
export type UserLoginData = {
  email: string;
  password: string;
};
