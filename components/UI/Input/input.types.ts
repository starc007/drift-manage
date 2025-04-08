import { InputHTMLAttributes, ReactNode } from "react";

export interface InputOptions extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  label?: string;
  error?: boolean;
  errorText?: string;
  isInputRequired?: boolean;
  icon?: ReactNode;
}
