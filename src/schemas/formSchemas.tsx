import { z, ZodType } from "zod";

import { isValidCPF } from "@/utils/cpfUtils";
import { generos } from "@/config/cadastroConfigs";
import { PacFormData } from "@/types/FormDataTypes";

const formSchema: ZodType<PacFormData> = z
  .object({
    pac_name: z.string().min(3, { message: "Nome é obrigatório" }),
    pac_sex: z.enum(generos, { message: "Campo obrigatório" }),
    pac_whatsapp: z.string().min(11, { message: "Campo obrigatório" }),
    pac_cpf: z
      .string()
      .min(11, { message: "CPF deve conter 11 dígitos" })
      .refine(isValidCPF, { message: "CPF inválido" })
      .optional(),
    pac_birth_date: z
      .string()
      .min(1, { message: "Campo obrigatório" })
      .refine((value) => !isNaN(Date.parse(value)), {
        message: "Data de nascimento inválida",
      }),
    pac_email: z
      .string()
      .min(1, { message: "Campo obrigatório" })
      .email({ message: "Email inválido" })
      .optional(),
    pac_addrs_street_name: z.string().min(1, { message: "Campo obrigatório" }),
    pac_addrs_num: z.string().min(1, { message: "Campo obrigatório" }),
    pac_addrs_bairro: z.string().min(1, { message: "Campo obrigatório" }),
    pac_addrs_city: z.string().min(1, { message: "Campo obrigatório" }),
    pac_addrs_uf: z.string().min(1, { message: "Campo obrigatório" }),
    pac_addrs_zip: z.string().min(8, { message: "Campo obrigatório" }),
    pac_addrs_comp: z.string().optional(),
    pac_has_resp: z.boolean(), // This is a boolean, no need to handle it like a string
    pac_resp_name: z.string().optional(),
    pac_resp_email: z
      .string()
      .email("Email do responsável inválido")
      .optional(),
    pac_resp_whatsapp: z.string().optional(),
    pac_resp_education: z.string().optional(),
    pac_resp_occupation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If pac_has_resp is true, these fields must be required
    if (data.pac_has_resp) {
      if (!data.pac_resp_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pac_resp_name"],
          message: "Nome do responsável é obrigatório",
        });
      }
      if (!data.pac_resp_email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pac_resp_email"],
          message: "Email do responsável é obrigatório",
        });
      }
      if (!data.pac_resp_whatsapp) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pac_resp_whatsapp"],
          message: "Telefone do responsável é obrigatório",
        });
      }
      if (!data.pac_resp_education) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pac_resp_education"],
          message: "Educação do responsável é obrigatória",
        });
      }
      if (!data.pac_resp_occupation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pac_resp_occupation"],
          message: "Ocupação do responsável é obrigatória",
        });
      }
    }
  });

export default formSchema;
