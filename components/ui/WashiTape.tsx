import { cn } from "@/lib/utils/cn";

const colorClasses = {
  rose: "bg-rose/60",
  sage: "bg-sage/60",
  lavender: "bg-lavender/60",
  kraft: "bg-kraft/70",
} as const;

export function WashiTape({
  color = "rose",
  className,
  rotate = -4,
}: {
  color?: keyof typeof colorClasses;
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      className={cn("washi-tape", colorClasses[color], className)}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    />
  );
}
