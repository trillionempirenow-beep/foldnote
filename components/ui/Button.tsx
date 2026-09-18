import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-rose text-paper hover:bg-[#b56a6e] shadow-[0_4px_0_0_#9c5a5e] hover:shadow-[0_2px_0_0_#9c5a5e] hover:translate-y-[2px]",
  secondary:
    "bg-paper text-ink border-2 border-ink/15 hover:border-ink/30 shadow-[0_4px_0_0_rgba(58,49,43,0.15)] hover:shadow-[0_2px_0_0_rgba(58,49,43,0.15)] hover:translate-y-[2px]",
  ghost: "bg-transparent text-ink underline decoration-dotted underline-offset-4 hover:text-rose",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-[family-name:var(--font-quicksand)] font-semibold transition-all duration-150 -rotate-[0.4deg]";

export function Button({
  variant = "primary",
  className,
  children,
  href,
  ...props
}: BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: string }) {
  if (href) {
    return (
      <Link href={href} className={cn(base, variantClasses[variant], className)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cn(base, variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
}
