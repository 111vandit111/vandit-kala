import React from "react";

interface buttonProps {
  children: React.ReactNode;
  variant?: string;
  size?: string;
  className?: string;
  onClick?: () => void;
}

const Button = ({
  children,
  variant,
  size,
  className,
  onClick,
}: buttonProps) => {
  const buttonVairants: Record<string, string> = {
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
      onClick={onClick}
      className={`${buttonVairants[variant || "primary"]} ${
        buttonSizes[size || "md"]
      } ${className} cursor-pointer`}
    >
      {children}
    </button>
  );
};

export default Button;
