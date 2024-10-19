// types/pacDataTypes.ts
import { generos } from "@/pages/configs/cadastroConfigs";

type FormData = {
  pac_id: string;
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
  pac_addrs_has_comp: boolean;
  pac_addrs_comp?: string;
  pac_has_resp: boolean;
  pac_resp_name?: string;
  pac_resp_email?: string;
  pac_resp_whatsapp?: string;
  pac_resp_education?: string;
  pac_resp_occupation?: string;
};

export default FormData;
