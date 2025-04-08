"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { InputOptions } from "./input.types";

const Input = (props: InputOptions) => {
  const {
    id,
    wrapperClassName = "",
    inputClassName = "",
    labelClassName = "",
    placeholder = "",
    label = "",
    type = "text",
    error = false,
    errorText = "",
    isInputRequired = false,
    icon,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={wrapperClassName}>
      <label
        htmlFor={id}
        className={clsx("text-primary/60 text-sm", labelClassName)}
      >
        {label} {isInputRequired && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`border border-primary/10 transition duration-300 ease-in-out rounded-xl mt-1 flex items-center ${
          error
            ? "focus-within:border-red-500 border-red-500"
            : "focus-within:border-primary/60"
        }`}
        onClick={() => inputRef?.current?.focus()}
      >
        {icon && (
          <div
            className={clsx(
              "pl-3 transition-colors duration-300",
              isFocused ? "text-primary" : "text-primary-disabled"
            )}
          >
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          type={type}
          className={clsx(
            "w-full px-2 h-10 text-primary text-base rounded-xl focus:outline-none placeholder:text-primary/60 placeholder:text-sm",
            inputClassName
          )}
          id={id}
          placeholder={placeholder}
          required={isInputRequired}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
      </div>
      {errorText && <p className="text-xs pt-1 text-red-500">{errorText}</p>}
    </div>
  );
};

export default Input;
