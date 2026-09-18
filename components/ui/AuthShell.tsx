import Link from "next/link";
import { Polaroid } from "@/components/ui/Polaroid";
import { WashiTape } from "@/components/ui/WashiTape";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="paper-texture relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute left-[8%] top-[12%] hidden sm:block">
        <Polaroid tapeColor="sage" rotate={-8} width={130} height={155} />
      </div>
      <div className="pointer-events-none absolute right-[10%] bottom-[14%] hidden sm:block">
        <Polaroid tapeColor="lavender" rotate={7} width={140} height={165} />
      </div>
      <div className="pointer-events-none absolute right-[16%] top-[16%] hidden text-3xl md:block">
        🌿
      </div>

      <Link
        href="/"
        className="absolute left-6 top-6 font-[family-name:var(--font-playfair)] text-xl italic text-ink/80 hover:text-ink"
      >
        Foldnote
      </Link>

      <div className="relative z-10 w-full max-w-md rounded-lg border border-ink/10 bg-paper p-8 paper-shadow sm:p-10">
        <WashiTape
          color="rose"
          rotate={-6}
          className="left-1/2 -top-3 -translate-x-1/2"
        />
        <p className="text-center font-[family-name:var(--font-patrick-hand)] text-rose">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-center font-[family-name:var(--font-caveat)] text-4xl text-ink">
          {title}
        </h1>
        <p className="mt-2 text-center font-[family-name:var(--font-nunito)] text-sm text-ink/60">
          {subtitle}
        </p>

        <div className="mt-8">{children}</div>

        <div className="mt-6 text-center font-[family-name:var(--font-nunito)] text-sm text-ink/70">
          {footer}
        </div>
      </div>
    </div>
  );
}
