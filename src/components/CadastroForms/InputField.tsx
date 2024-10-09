/* eslint-disable prettier/prettier */
import React from 'react';
import { Input } from "@nextui-org/react";

import {cadastroSchema} from '@/schemas/formSchemas'


export default function InputField({
  label,
  labelPlacement = "outside",
  name,
  color,
  className,
  placeholder,
  value,
  onChange,
  isRequired,
  maxLength,
  isInvalid,
  errorMessage,
  type,

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
  isInvalid: boolean;
  isRequired: boolean;
  maxLength?: number;
  type?: string;

}) {
  const valueMasked = (value: string) => {
  }
  return (
    

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
      value={value}
        onChange={onChange}

    />
  );
}
