import { z, ZodType, ZodIssueCode } from "zod";
import {
  UserSignUpFormData,
  UserLoginData,
  UserProfile,
  UserResetPasswordData,
  UserUpdatePasswordData,
} from "@/types/FormDataTypes";

export const CreateUserSchema: ZodType<UserSignUpFormData> = z
  .object({
    id: z.string().optional(),
    email: z
      .string()
      .email({ message: "Email inválido" })
      .max(50, { message: "Email deve ter no máximo 50 caracteres" }),
    email_confirmation: z
      .string()
      .email({ message: "Confirmação de Email inválido" })
      .max(50, { message: "Email deve ter no máximo 50 caracteres" }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/, {
        message:
          "A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial",
      })
      .max(20, { message: "A senha deve ter no máximo 20 caracteres" }),
    password_confirmation: z
      .string()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/, {
        message:
          "A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial",
      })
      .max(20, { message: "A senha deve ter no máximo 20 caracteres" }),
  })
  .superRefine((data, ctx) => {
    if (data.email !== data.email_confirmation) {
      ctx.addIssue({
        code: ZodIssueCode.custom, // Adicione o código aqui
        path: ["email_confirmation"],
        message: "Os emails devem ser iguais",
      });
    }

    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: ZodIssueCode.custom, // Adicione o código aqui
        path: ["password_confirmation"],
        message: "As senhas devem ser iguais",
      });
    }
  });

export const UserProfileSchema: ZodType<UserProfile> = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, { message: "O Nome deve ter no mínimo 3 caracteres" }),
  last_name: z
    .string()
    .min(3, { message: "O Sobrenome deve ter no mínimo 3 caracteres" }),
  sex: z.string(),
  phone: z.string().min(11, { message: "O Telefone deve ter 11 dígitos" }),
  birth_date: z.string(),
  city: z.string().min(3, { message: "Nome da cidade inválido" }),
  uf: z.string().max(2, { message: "UF inválida" }),
  area_de_atuacao: z.string(),
  bio: z.string().optional(),
  about_me: z
    .string()
    .max(500, { message: "Máximo de 500 caracteres" })
    .optional(),
  title: z.string(),
  publico_preferencial: z.string(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  email_contato: z.string().email("Email inválido").optional(),
  contato_whatsapp: z.string().optional(),
  modalidade_atendimento: z.string(),
});

export const UserSignInFormSchema: ZodType<UserLoginData> = z.object({
  email: z
    .string()
    .email({ message: "Email inválido" })
    .max(50, { message: "Email deve ter no máximo 50 caracteres" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/, {
      message:
        "A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial",
    })
    .max(20, { message: "A senha deve ter no máximo 20 caracteres" }),
  //TODO: Add Validation to especialidades list(config file)
});

export const UserResetPasswordSchema: ZodType<UserResetPasswordData> = z.object(
  {
    email: z
      .string()
      .email({ message: "Email inválido" })
      .max(50, { message: "Email deve ter no máximo 50 caracteres" }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/, {
        message:
          "A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial",
      })
      .max(20, { message: "A senha deve ter no máximo 20 caracteres" })
      .optional(),
  }
);

export const UserUpdatePasswordSchema: ZodType<UserUpdatePasswordData> =
  z.object({
    email: z
      .string()
      .email({ message: "Email inválido" })
      .max(50, { message: "Email deve ter no máximo 50 caracteres" })
      .optional(),
    password: z
      .string()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/, {
        message:
          "A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial",
      })
      .max(20, { message: "A senha deve ter no máximo 20 caracteres" })
      .optional(),
  });
