/* eslint-disable prettier/prettier */
import { DatePicker } from "@nextui-org/react";
import { getLocalTimeZone, today, DateValue } from "@internationalized/date";

export default function InputField({
  label,
  labelPlacement = "outside",
  showMonthAndYearPickers = true,
  className,
  value,
  onChange,
  errorMessage,
  isInvalid,
  isRequired,
}: {
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "default"
    | "danger"
    | undefined;

  label: string;
  labelPlacement: "outside" | "outside-left" | "inside" | undefined;
  name: string;
  className?: string;
  value?: DateValue | null; // Mantém DateValue | null
  onChange: (value: DateValue | null) => void; // Mantém DateValue | null
  errorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  maxLength?: number;
  showMonthAndYearPickers?: boolean;
}) {
  const timeZone = getLocalTimeZone();

  return (
    <DatePicker
      className={className}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      isRequired={isRequired}
      label={label}
      labelPlacement={labelPlacement}
      maxValue={today(timeZone)}
      showMonthAndYearPickers={showMonthAndYearPickers}
      value={value} // `value` já está no formato correto
      onChange={onChange} // Mantém a função `onChange`
    />
  );
}
