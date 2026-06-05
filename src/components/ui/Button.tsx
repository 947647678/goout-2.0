import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 ease-spring",
        variant === "primary" &&
          "bg-vital text-white hover:shadow-card-hover active:scale-[0.98]",
        variant === "outline" &&
          "border border-base text-base hover:bg-base/5",
        variant === "ghost" && "text-text-muted hover:text-vital",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-2.5 text-[15px]",
        size === "lg" && "px-8 py-3 text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
