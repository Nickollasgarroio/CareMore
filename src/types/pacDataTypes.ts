// types/pacDataTypes.ts

export interface PacData {
  pac_name: { value: string; required: boolean };
  pac_sex: { value: string; required: boolean };
  pac_whatsapp: { value: string; required: boolean };
  pac_cpf: { value: string; required: boolean };
  pac_birth_date: { value: string; required: boolean };
  pac_email: { value: string; required: boolean };
  pac_addrs_street_name: { value: string; required: boolean };
  pac_addrs_has_comp: { value: boolean; required: boolean };
  pac_addrs_num: { value: string; required: boolean };
  pac_addrs_zip: { value: string; required: boolean };
  pac_addrs_comp: { value: string; required: boolean };
  pac_has_resp: { value: boolean; required: boolean };
  pac_resp_name: { value: string; required: boolean };
  pac_resp_email: { value: string; required: boolean };
  pac_resp_whatsapp: { value: string; required: boolean };
  pac_resp_education: { value: string; required: boolean };
  pac_resp_ocupation: { value: string; required: boolean };
}
