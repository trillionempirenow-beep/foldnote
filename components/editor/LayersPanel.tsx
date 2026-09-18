"use client";

import { Type, ImageIcon, Shapes, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type LayerEntry = {
  key: number;
  kind: "text" | "image" | "other";
  label: string;
  active: boolean;
  visible: boolean;
};

export function LayersPanel({
  layers,
  onSelect,
  onToggleVisible,
}: {
  layers: LayerEntry[];
  onSelect: (key: number) => void;
  onToggleVisible: (key: number) => void;
}) {
  return (
    <div className="paper-shadow absolute bottom-4 right-4 z-20 w-56 rotate-[0.3deg] rounded-xl border border-ink/10 bg-white/95 p-3 backdrop-blur">
      <p className="mb-2 font-[family-name:var(--font-patrick-hand)] text-sm text-ink/50">
        Layers
      </p>
      {layers.length === 0 ? (
        <p className="px-1 py-3 text-center font-[family-name:var(--font-nunito)] text-xs text-ink/40">
          Nothing on this page yet.
        </p>
      ) : (
        <ul className="max-h-56 space-y-1 overflow-y-auto">
          {[...layers].reverse().map((layer) => {
            const Icon =
              layer.kind === "text"
                ? Type
                : layer.kind === "image"
                  ? ImageIcon
                  : Shapes;
            return (
              <li key={layer.key}>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                    layer.active
                      ? "bg-rose/10 text-rose"
                      : "text-ink/70 hover:bg-ink/5",
                  )}
                >
                  <button
                    onClick={() => onSelect(layer.key)}
                    className="flex flex-1 items-center gap-2 truncate text-left"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{layer.label}</span>
                  </button>
                  <button
                    onClick={() => onToggleVisible(layer.key)}
                    className="text-ink/40 hover:text-ink"
                  >
                    {layer.visible ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
