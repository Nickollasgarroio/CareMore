import { z, ZodType } from "zod";
import { isValidCPF } from "@/utils/cpfUtils";
import { generos } from "@/pages/configs/cadastroConfigs";
import FormData from "@/types/FormDataTypes";

const formSchema: ZodType<FormData> = z
  .object({
    pac_name: z
      .string()
      .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "Nome deve conter apenas letras" }),

    pac_sex: z.enum(generos, {
      message: "Selecione um gênero válido",
    }),

    pac_whatsapp: z
      .string()
      .min(11, { message: "Whatsapp deve conter 11 dígitos" }),

    pac_cpf: z
      .string()
      .min(11, { message: "CPF deve conter 11 dígitos" })
      .refine(isValidCPF, {
        message: "CPF inválido",
      })
      .optional(),

    pac_birth_date: z
      .string()
      .min(1, { message: "Data de nascimento é obrigatória" })
      .refine((value) => !isNaN(Date.parse(value)), {
        message: "Data de nascimento inválida",
      })
      .refine(
        (value) => {
          const date = new Date(value);
          const today = new Date();
          return date <= today;
        },
        { message: "Data de nascimento não pode ser futura" }
      ),

    pac_email: z.string().email({ message: "Email inválido" }).optional(),

    pac_addrs_street_name: z
      .string()
      .min(3, { message: "Endereço deve ter pelo menos 3 caracteres" }),

    pac_addrs_num: z
      .string()
      .min(1, { message: "Número é obrigatório" })
      .regex(/^\d+$/, { message: "Número deve conter apenas dígitos" }),

    pac_addrs_bairro: z
      .string()
      .min(2, { message: "Bairro deve ter pelo menos 2 caracteres" }),

    pac_addrs_city: z
      .string()
      .min(2, { message: "Cidade deve ter pelo menos 2 caracteres" }),

    pac_addrs_uf: z
      .string()
      .length(2, { message: "UF deve ter exatamente 2 caracteres" })
      .regex(/^[A-Z]+$/, {
        message: "UF deve conter apenas letras maiúsculas",
      }),

    pac_addrs_zip: z
      .string()
      .min(8, { message: "CEP deve ter exatamente 8 dígitos" }),

    pac_addrs_comp: z.string().optional(),

    pac_has_resp: z.boolean().default(false),

    // Campos do responsável com validação condicional
    pac_resp_name: z.string().optional(),

    pac_resp_email: z.string().email("Email Inválido").optional(),

    pac_resp_whatsapp: z.string().optional(),

    pac_resp_education: z.string().optional(),

    pac_resp_occupation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.pac_has_resp) {
      // Validações específicas para campos do responsável quando pac_has_resp é true
      if (!data.pac_resp_name || data.pac_resp_name.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pac_resp_name"],
          message: "Nome do responsável deve ter pelo menos 3 caracteres",
        });
      }

      if (!data.pac_resp_email || !data.pac_resp_email.includes("@")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pac_resp_email"],
          message: "Email do responsável é obrigatório e deve ser válido",
        });
      }

      if (!data.pac_resp_whatsapp || data.pac_resp_whatsapp.length < 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pac_resp_whatsapp"],
          message: "Telefone do responsável deve ter pelo menos 11 dígitos",
        });
      }

      if (!data.pac_resp_education || data.pac_resp_education.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pac_resp_education"],
          message: "Educação do responsável é obrigatória",
        });
      }

      if (!data.pac_resp_occupation || data.pac_resp_occupation.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pac_resp_occupation"],
          message: "Ocupação do responsável é obrigatória",
        });
      }
    }
  });

export default formSchema;
