import { z, ZodType } from "zod";

import { isValidCPF } from "@/utils/cpfUtils";

import { PacFormData } from "@/types/FormDataTypes";

export const formSchema: ZodType<PacFormData> = z
  .object({
    prof_id: z.string().optional(),
    pac_id: z.string().optional(),
    name: z.string().min(3, { message: "Nome é obrigatório" }),
    sex: z.string({ message: "Campo obrigatório" }),
    whatsapp: z.string().min(11, { message: "Campo obrigatório" }),
    cpf: z
      .string()
      .min(11, { message: "CPF deve conter 11 dígitos" })
      .refine(isValidCPF, { message: "CPF inválido" })
      .optional(),
    birth_date: z
      .string()
      .min(1, { message: "Campo obrigatório" })
      .refine((value) => !isNaN(Date.parse(value)), {
        message: "Data de nascimento inválida",
      }),
    email: z
      .string()
      .min(1, { message: "Campo obrigatório" })
      .email({ message: "Email inválido" })
      .optional(),
    addrs_street_name: z.string().min(1, { message: "Campo obrigatório" }),
    addrs_num: z.string().min(1, { message: "Campo obrigatório" }),
    addrs_bairro: z.string().min(1, { message: "Campo obrigatório" }),
    addrs_city: z.string().min(1, { message: "Campo obrigatório" }),
    addrs_uf: z.string().min(1, { message: "Campo obrigatório" }),
    addrs_zip: z.string().min(8, { message: "Campo obrigatório" }),
    addrs_comp: z.string().optional(),
    pac_has_resp: z.boolean(), // This is a boolean, no need to handle it like a string
    resp_name: z.string().optional(),
    resp_email: z.string().optional(),
    resp_whatsapp: z.string().optional(),
    resp_education: z.string().optional(),
    resp_occupation: z.string().optional(),
    status: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If has_resp is true, these fields must be required
    if (data.pac_has_resp) {
      if (!data.resp_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["resp_name"],
          message: "Nome do responsável é obrigatório",
        });
      }
      if (!data.resp_email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["resp_email"],
          message: "Email do responsável é obrigatório",
        });
      }
      if (!data.resp_whatsapp) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["resp_whatsapp"],
          message: "Telefone do responsável é obrigatório",
        });
      }
      if (!data.resp_education) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["resp_education"],
          message: "Educação do responsável é obrigatória",
        });
      }
      if (!data.resp_occupation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["resp_occupation"],
          message: "Ocupação do responsável é obrigatória",
        });
      }
    }
  });

export default formSchema;
