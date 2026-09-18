import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link
        href="/"
        className="font-[family-name:var(--font-playfair)] text-2xl italic text-ink"
      >
        Foldnote
      </Link>
      <nav className="hidden items-center gap-8 font-[family-name:var(--font-quicksand)] text-sm font-medium text-ink/70 sm:flex">
        <Link href="#how-it-works" className="hover:text-ink">
          How it works
        </Link>
        <Link href="#use-cases" className="hover:text-ink">
          Use cases
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <Button href="/login" variant="ghost" className="px-3 py-2 text-sm rotate-0">
          Log in
        </Button>
        <Button href="/signup" variant="primary" className="px-5 py-2.5 text-sm">
          Begin Your Pages
        </Button>
      </div>
    </header>
  );
}
