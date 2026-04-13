import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full border font-medium tracking-[-0.01em] transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(183,152,102,0.35)] disabled:pointer-events-none disabled:opacity-50";

  const sizes: Record<ButtonSize, string> = {
    sm: "h-11 px-4 text-sm",
    md: "h-12 px-6 text-sm sm:text-[15px]"
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "border-[var(--color-forest)] bg-[var(--color-forest)] text-[var(--color-surface-strong)] shadow-[0_14px_28px_rgba(23,52,42,0.18)] hover:-translate-y-0.5 hover:bg-[var(--color-forest-soft)] hover:shadow-[0_18px_36px_rgba(23,52,42,0.2)]",
    secondary:
      "border-[var(--color-border-strong)] bg-[rgba(255,255,255,0.56)] text-[var(--color-text)] hover:-translate-y-0.5 hover:border-[rgba(27,39,33,0.26)] hover:bg-[rgba(255,255,255,0.8)]",
    tertiary:
      "border-transparent bg-transparent text-[var(--color-forest)] hover:-translate-y-0.5 hover:bg-[rgba(23,52,42,0.06)]"
  };

  return cn(base, sizes[size], variants[variant], className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
});
