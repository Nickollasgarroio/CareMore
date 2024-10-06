/* eslint-disable prettier/prettier */
import { Select, SelectItem } from "@nextui-org/react";
import React from "react";

export default function InputField({
  label,
  labelPlacement = "outside",
  name,
  color,
  className,
  placeholder,
  value,
  onChange,
  errorMessage,
  isInvalid,
  isRequired,
  options, // Passar as opções como uma propriedade
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
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Tipo ajustado para HTMLSelectElement
  errorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  maxLength?: number;
  options: { label: string; value: string }[]; // Array de opções
}) {
  return (
    <Select
      errorMessage={errorMessage}
      isInvalid={Boolean(isInvalid)}
      isRequired={isRequired}
      label={label}
      labelPlacement={labelPlacement}
      name={name}
      placeholder={placeholder}
      value={value}
      color={color}
      onChange={onChange}
      className={className}
    >
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
}
