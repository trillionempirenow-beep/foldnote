"use client";

import { useRef } from "react";
import {
  Type,
  ImagePlus,
  Sticker,
  Palette,
  Music2,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

function ToolButton({
  icon: Icon,
  label,
  onClick,
  comingSoon,
  active,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  comingSoon?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={comingSoon}
      title={comingSoon ? `${label} — coming in Phase 4` : label}
      className={cn(
        "group relative flex h-12 w-12 flex-col items-center justify-center rounded-xl transition-colors",
        comingSoon
          ? "cursor-not-allowed text-ink/25"
          : active
            ? "bg-rose/15 text-rose"
            : "text-ink/70 hover:bg-rose/10 hover:text-rose",
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="pointer-events-none absolute left-full ml-2 z-20 hidden -rotate-1 whitespace-nowrap rounded-md bg-ink px-2 py-1 font-[family-name:var(--font-patrick-hand)] text-xs text-paper shadow-md group-hover:block">
        {comingSoon ? `${label} · Phase 4` : label}
      </span>
    </button>
  );
}

export function Toolbar({
  onAddText,
  onAddImage,
  onToggleLayers,
  onToggleStickers,
  onToggleBackgrounds,
  activePanel,
}: {
  onAddText: () => void;
  onAddImage: (file: File) => void;
  onToggleLayers: () => void;
  onToggleStickers: () => void;
  onToggleBackgrounds: () => void;
  activePanel: "none" | "layers" | "stickers" | "backgrounds";
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <nav className="flex w-[76px] shrink-0 flex-col items-center gap-1 border-r border-ink/10 bg-paper/60 py-4">
      <ToolButton icon={Type} label="Text" onClick={onAddText} />
      <ToolButton
        icon={ImagePlus}
        label="Images"
        onClick={() => fileInputRef.current?.click()}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onAddImage(file);
          e.target.value = "";
        }}
      />

      <div className="my-2 h-px w-8 bg-ink/10" />

      <ToolButton
        icon={Sticker}
        label="Stickers"
        onClick={onToggleStickers}
        active={activePanel === "stickers"}
      />
      <ToolButton
        icon={Palette}
        label="Backgrounds"
        onClick={onToggleBackgrounds}
        active={activePanel === "backgrounds"}
      />
      <ToolButton icon={Music2} label="Music" comingSoon />

      <div className="my-2 h-px w-8 bg-ink/10" />

      <ToolButton
        icon={Layers}
        label="Layers"
        onClick={onToggleLayers}
        active={activePanel === "layers"}
      />
    </nav>
  );
}
