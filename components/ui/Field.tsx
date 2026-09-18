import type { InputHTMLAttributes } from "react";

export function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-[family-name:var(--font-quicksand)] text-sm font-medium text-ink/80">
        {label}
      </span>
      <input
        className="w-full rounded-md border border-ink/15 bg-white/70 px-4 py-2.5 font-[family-name:var(--font-nunito)] text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-rose focus:ring-2 focus:ring-rose/20"
        {...props}
      />
    </label>
  );
}
