"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] text-[var(--accent-ink)] hover:brightness-110 shadow-[0_10px_30px_rgba(184,255,60,0.2)]",
        secondary:
          "bg-white/8 text-white border border-white/10 hover:bg-white/12",
        outline:
          "border border-white/15 bg-transparent text-white hover:bg-white/5",
        ghost: "text-white/80 hover:bg-white/6 hover:text-white",
        danger: "bg-[var(--danger)] text-white hover:brightness-110",
        soft: "bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
