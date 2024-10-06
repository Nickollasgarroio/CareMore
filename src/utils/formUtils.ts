// utils/formUtils.ts
import { formatCPF } from "./cpfUtils";
import { formatPhone } from "./phoneUtils";
import { formatZipCode } from "./zipUtils";

export const formatFieldValue = (name: string, value: string) => {
  switch (name) {
    case "pac_cpf":
      return formatCPF(value);
    case "pac_whatsapp":
    case "pac_resp_whatsapp":
      return formatPhone(value);
    case "pac_addrs_zip":
      return formatZipCode(value);
    default:
      return value;
  }
};
