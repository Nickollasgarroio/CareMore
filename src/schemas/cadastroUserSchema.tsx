import { z, ZodType, ZodIssueCode } from "zod";
import { UserFormData } from "@/types/FormDataTypes";

const UserFormSchema: ZodType<UserFormData> = z
  .object({
    user_id: z.string().optional(),
    user_name: z
      .string()
      .min(3, { message: "Nome é obrigatório" })
      .max(50, { message: "Nome deve ter no máximo 50 caracteres" }),
    user_email: z
      .string()
      .email({ message: "Email inválido" })
      .max(50, { message: "Email deve ter no máximo 50 caracteres" }),
    user_email_confirmation: z
      .string()
      .email({ message: "Confirmação de Email inválido" })
      .max(50, { message: "Email deve ter no máximo 50 caracteres" }),
    user_password: z
      .string()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/, {
        message:
          "A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial",
      })
      .max(20, { message: "A senha deve ter no máximo 20 caracteres" }),
    user_password_confirmation: z
      .string()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/, {
        message:
          "A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial",
      })
      .max(20, { message: "A senha deve ter no máximo 20 caracteres" }),
    user_phone: z
      .string()
      .min(11, { message: "O Telefone deve ter 11 dígitos" })
      .optional(),
    user_birth_date: z.string().optional(),
    user_role: z.enum(["user", "admin"]),
    user_especialidade: z.string(), //TODO: Add Validation to especialidades list(config file)
  })
  .superRefine((data, ctx) => {
    if (data.user_email !== data.user_email_confirmation) {
      ctx.addIssue({
        code: ZodIssueCode.custom, // Adicione o código aqui
        path: ["user_email_confirmation"],
        message: "Os emails devem ser iguais",
      });
    }

    if (data.user_password !== data.user_password_confirmation) {
      ctx.addIssue({
        code: ZodIssueCode.custom, // Adicione o código aqui
        path: ["user_password_confirmation"],
        message: "As senhas devem ser iguais",
      });
    }
  });

export default UserFormSchema;
