"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Undo2, Redo2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type SaveStatus = "saved" | "saving" | "unsaved";

const statusCopy: Record<SaveStatus, string> = {
  saved: "Saved",
  saving: "Saving...",
  unsaved: "Unsaved changes",
};

export function Topbar({
  title,
  onRename,
  saveStatus,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: {
  title: string;
  onRename: (title: string) => void;
  saveStatus: SaveStatus;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  const [value, setValue] = useState(title);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-ink/10 bg-paper/95 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-ink"
          title="Back to Corkboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            const trimmed = value.trim();
            if (trimmed && trimmed !== title) onRename(trimmed);
            else setValue(title);
          }}
          className="w-48 truncate rounded-md border border-transparent bg-transparent px-2 py-1 font-[family-name:var(--font-patrick-hand)] text-lg text-ink outline-none hover:border-ink/10 focus:border-ink/20 focus:bg-white sm:w-72"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Redo2 className="h-4 w-4" />
        </button>
        <span
          className={cn(
            "ml-2 hidden font-[family-name:var(--font-nunito)] text-xs sm:inline",
            saveStatus === "unsaved" ? "text-rose" : "text-ink/40",
          )}
        >
          {statusCopy[saveStatus]}
        </span>
      </div>
    </header>
  );
}
