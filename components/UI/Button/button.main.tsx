import { forwardRef } from "react";
import { ButtonProps, ButtonSize, ButtonVariant, Ref } from "./button.types";
import clsx from "clsx";

const colorMap = {
  primary: "bg-primary text-background",
  danger: "bg-red-500 text-white",
  link: "text-primary",
  secondary: "bg-primary/10 text-primary",
} as Record<ButtonVariant, string>;

const sizeMap = {
  small: "px-3 py-1 text-sm",
  medium: "px-4 py-2.5",
  large: "px-10 py-3 text-lg",
} as Record<ButtonSize, string>;

const Button = forwardRef<Ref, ButtonProps>((props, ref) => {
  const {
    variant = "primary",
    className,
    children,
    size = "medium",
    ...rest
  } = props;

  const merged = clsx(
    "flex items-center justify-center gap-1.5 font-medium h-10 duration-300 transition rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
    colorMap[variant],
    sizeMap[size],
    className
  );

  return (
    <button ref={ref} className={merged} {...rest}>
      {props?.showloading ? (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <>
          {props?.lefticon && props?.lefticon}
          {children}
          {props?.righticon && props?.righticon}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
