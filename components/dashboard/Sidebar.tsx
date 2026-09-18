"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BookHeart,
  LayoutTemplate,
  Mail,
  MessageSquareHeart,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/keepsakes", label: "My Keepsakes", icon: BookHeart },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/paper-mail", label: "Paper Mail", icon: Mail },
  {
    href: "/dashboard/visitor-messages",
    label: "Visitor Messages",
    icon: MessageSquareHeart,
  },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col border-r border-ink/10 bg-paper px-5 py-8">
      <Link
        href="/"
        className="mb-8 font-[family-name:var(--font-playfair)] text-xl italic text-ink"
      >
        Foldnote
      </Link>
      <p className="mb-6 font-[family-name:var(--font-caveat)] text-lg text-ink/60">
        Hi, {name} 🌷
      </p>
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 font-[family-name:var(--font-quicksand)] text-sm font-medium transition-colors",
                active
                  ? "bg-rose/15 text-rose"
                  : "text-ink/70 hover:bg-ink/5 hover:text-ink",
              )}
            >
              <link.icon className="h-4 w-4" strokeWidth={1.75} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-md px-3 py-2 font-[family-name:var(--font-quicksand)] text-sm font-medium text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.75} />
        Log out
      </button>
    </aside>
  );
}
