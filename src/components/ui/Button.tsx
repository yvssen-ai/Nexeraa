import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-full " +
  "font-medium tracking-tight transition-colors duration-300 " +
  // 44px minimum touch target on every variant
  "min-h-[2.875rem] px-6 text-[0.9375rem] sm:min-h-[3.25rem] sm:px-8 sm:text-base";

const variants = {
  primary:
    "text-white bg-linear-to-r from-blue to-violet " +
    "shadow-[0_0_0_0_rgba(139,92,246,0)] hover:shadow-[0_10px_40px_-8px_rgba(139,92,246,0.55)]",
  ghost: "text-ink border border-line-2 hover:border-violet/60 hover:bg-violet/[0.07]",
  solid: "text-void bg-ink hover:bg-white",
} as const;

type Props<T extends ElementType> = {
  as?: T;
  variant?: keyof typeof variants;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export default function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  children,
  className = "",
  ...rest
}: Props<T>) {
  const Tag = (as ?? "button") as ElementType;
  return (
    <Tag className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {/* Sheen sweep on hover — a transform, so it stays off the paint path */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden"
      />
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
    </Tag>
  );
}
