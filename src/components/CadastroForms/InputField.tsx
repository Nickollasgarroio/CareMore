/* eslint-disable prettier/prettier */
import React from 'react';
import { Input } from "@nextui-org/react";
import InputMask from "react-input-mask";

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
  maxLength,
  type,
  mask,
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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  maxLength?: number;
  type?: string;
  mask?: string;
}) {
  return mask ? (
    // Se houver uma máscara, renderize o InputMask
    <InputMask mask={mask} value={value} onChange={onChange}>
      {/* Renderize o componente Input diretamente como filho do InputMask */}
      <Input
        className={className}
        color={color}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
        isRequired={isRequired}
        label={label}
        labelPlacement={labelPlacement}
        maxLength={maxLength}
        name={name}
        placeholder={placeholder}
        type={type}
      />
    </InputMask>
  ) : (
    // Caso não tenha máscara, renderize o Input padrão
    <Input
      className={className}
      color={color}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      isRequired={isRequired}
      label={label}
      labelPlacement={labelPlacement}
      maxLength={maxLength}
      name={name}
      placeholder={placeholder}
      value={value}
      type={type}
      onChange={onChange}
    />
  );
}
