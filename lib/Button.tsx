import React from "react";

interface buttonProps {
  children: React.ReactNode;
  variant?: string;
  size?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}

const Button = ({
  children,
  variant,
  size,
  className,
  onClick,
  type = "button",
  disabled,
  ariaLabel,
}: buttonProps) => {
  const buttonVairants: Record<string, string> = {
    prime:
      "bg-prime text-white rounded-lg px-3 py-1 font-semibold hover:bg-prime-dark disabled:opacity-50 disabled:cursor-not-allowed",
    primary: "bg-primary-500 px-3 py-1 rounded-lg",
    secondary: "bg-secondary-500 px-3 py-1 rounded-lg",
    alert: "bg-alert-500 px-3 py-1 rounded-lg",
    success: "bg-success-500 px-3 py-1 rounded-lg",
    warning: "bg-warning-500 px-3 py-1 rounded-lg",
    error: "bg-error-500 px-3 py-1 rounded-lg",
    info: "bg-info-500 px-3 py-1 rounded-lg",
    ghost: "px-3 py-1 rounded-lg text-white font-semibold bg-transparent hover:bg-white hover:text-secondary-900",
    glassMoprhism: "px-3 py-1 text-white rounded-lg bg-white/20 shadow-lg backdrop-blur-lg font-semibold hover:bg-white hover:text-secondary-900 transition-all duration-300",
  };
  const buttonSizes: Record<string, string> = {
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    icon: "rounded-full!"
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${buttonVairants[variant || "primary"]} ${
        buttonSizes[size || "md"]
      } ${className ?? ""} focus-visible:outline-2 focus-visible:outline-prime cursor-pointer`}
    >
      {children}
    </button>
  );
};

export default Button;
