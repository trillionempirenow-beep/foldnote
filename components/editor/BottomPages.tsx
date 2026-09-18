"use client";

import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { EditorPage } from "@/lib/types/editor";

export function BottomPages({
  pages,
  currentPageId,
  onSelect,
  onAdd,
  onDelete,
}: {
  pages: EditorPage[];
  currentPageId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex h-24 shrink-0 items-center gap-3 overflow-x-auto border-t border-ink/10 bg-paper/95 px-5 py-3">
      {pages.map((page, i) => {
        const active = page.id === currentPageId;
        return (
          <button
            key={page.id}
            onClick={() => onSelect(page.id)}
            className={cn(
              "group relative flex h-[60px] w-[48px] shrink-0 -rotate-1 items-center justify-center rounded-sm border bg-white font-[family-name:var(--font-patrick-hand)] text-sm transition-all paper-shadow",
              active
                ? "border-rose text-rose ring-2 ring-rose/30"
                : "border-ink/10 text-ink/50 hover:-translate-y-1 hover:border-ink/25",
            )}
            title={`Page ${i + 1}`}
          >
            {i + 1}
            {pages.length > 1 && (
              <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(page.id);
                }}
                className="absolute -right-1.5 -top-1.5 hidden h-4 w-4 items-center justify-center rounded-full bg-ink/70 text-paper group-hover:flex hover:bg-rose"
              >
                <X className="h-2.5 w-2.5" />
              </span>
            )}
          </button>
        );
      })}

      <button
        onClick={onAdd}
        title="Add a new page"
        className="flex h-[60px] w-[48px] shrink-0 rotate-1 items-center justify-center rounded-sm border-2 border-dashed border-ink/20 text-ink/40 transition-colors hover:border-rose hover:text-rose"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}
