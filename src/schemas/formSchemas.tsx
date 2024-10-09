import { z } from "zod";

import { isValidCPF } from "@/utils/cpfUtils";
import { isValidPhone } from "@/utils/phoneUtils";
import { isValidZipCode } from "@/utils/zipUtils";
import { newDate } from "react-datepicker/dist/date_utils";
import { today } from "@internationalized/date";

export const cadastroSchema = z.object({
  pac_name: z.string().min(3, { message: "Nome é obrigatório" }),
  pac_sex: z.enum(["Masculino", "Feminino", "Não Binário"], {
    errorMap: () => ({ message: "Sexo é obrigatório" }),
  }),
  pac_whatsapp: z.string(),
  pac_cpf: z.string(),
  
  pac_birth_date: z.string(),
  
  pac_addrs_street_name: z
    .string()
    .min(1, { message: "Endereço é obrigatório" }),
  pac_addrs_num: z.string().min(1, { message: "Número é obrigatório" }),
  pac_addrs_zip: z.string().refine(isValidZipCode, {
    message: "CEP inválido",
  }),
  pac_addrs_comp: z.string().optional(),
  pac_resp_name: z.string().optional(),
  pac_resp_email: z.string().email({ message: "Email inválido" }).optional(),
  pac_resp_whatsapp: z
    .string()
    .refine(isValidPhone, {
      message: "Número de WhatsApp do responsável inválido",
    })
    .optional(),
  pac_resp_education: z.string().optional(),
  pac_resp_ocupation: z.string().optional(),
});
