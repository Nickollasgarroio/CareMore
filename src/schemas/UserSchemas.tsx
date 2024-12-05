import { z, ZodType } from "zod";
import { EvolucaoType } from "@/types/FormDataTypes";

export const EvolucaoSchema: ZodType<EvolucaoType> = z.object({
  id: z.string().optional(),
  pac_id: z.string(),
  prof_id: z.string(),
  queixa: z.string().min(1, { message: "Campo obrigatório" }),
  observacao: z.string().min(1, { message: "Campo obrigatório" }),
  date: z.string(),
});
