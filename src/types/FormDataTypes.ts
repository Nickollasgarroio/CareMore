// types/pacDataTypes.ts

export type PacFormData = {
  prof_id?: string;
  pac_id?: string;
  name: string;
  sex: string;
  whatsapp: string;
  cpf?: string;
  birth_date: string;
  email?: string;
  addrs_street_name: string;
  addrs_num: string;
  addrs_bairro: string;
  addrs_city: string;
  addrs_uf: string;
  addrs_zip: string;
  addrs_comp?: string;
  pac_has_resp?: boolean;
  resp_name?: string;
  resp_email?: string;
  resp_whatsapp?: string;
  resp_education?: string;
  resp_occupation?: string;
  status?: string;
};

export type UserSignUpFormData = {
  email: string;
  email_confirmation: string;
  password: string;
  password_confirmation: string;
  role?: "admin" | "user";
};

export type UserResetPasswordData = {
  email: string;
  password?: string;
};

export type UserProfile = {
  id: string;
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
  modalidade_atendimento: string;
};
export type UserLoginData = {
  email: string;
  password: string;
};

export type EvolucaoType = {
  id?: string;
  pac_id: string;
  prof_id: string;
  queixa: string;
  observacao: string;
  date: string;
};
