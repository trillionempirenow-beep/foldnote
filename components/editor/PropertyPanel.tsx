"use client";

import {
  Copy,
  Trash2,
  Lock,
  Unlock,
  Group as GroupIcon,
  Ungroup,
  BringToFront,
  SendToBack,
  Image as ImageIcon,
} from "lucide-react";
import { FONT_OPTIONS } from "@/lib/editor/fonts";
import { cn } from "@/lib/utils/cn";

export type SelectionInfo = {
  kind: "none" | "text" | "image" | "group" | "multi" | "other";
  locked: boolean;
  isMulti: boolean;
  isGroupObject: boolean;
  fontVarName?: string;
  fontSize?: number;
  fill?: string;
  bold?: boolean;
  italic?: boolean;
};

export function PropertyPanel({
  selection,
  onFontChange,
  onFontSizeChange,
  onColorChange,
  onToggleBold,
  onToggleItalic,
  onDuplicate,
  onDelete,
  onToggleLock,
  onGroup,
  onUngroup,
  onBringForward,
  onSendBackward,
  onConvertToPolaroid,
}: {
  selection: SelectionInfo;
  onFontChange: (varName: string) => void;
  onFontSizeChange: (size: number) => void;
  onColorChange: (color: string) => void;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleLock: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onConvertToPolaroid: () => void;
}) {
  if (selection.kind === "none") return null;

  return (
    <div className="paper-shadow absolute right-4 top-4 z-20 w-64 -rotate-[0.3deg] rounded-xl border border-ink/10 bg-white/95 p-4 backdrop-blur">
      <p className="mb-3 font-[family-name:var(--font-patrick-hand)] text-sm text-ink/50">
        {selection.isMulti ? "Multiple objects" : selection.kind === "text" ? "Text" : selection.kind === "image" ? "Image" : "Object"}
      </p>

      {selection.kind === "text" && !selection.isMulti && (
        <div className="mb-4 space-y-3">
          <label className="block">
            <span className="mb-1 block font-[family-name:var(--font-quicksand)] text-xs font-semibold text-ink/60">
              Font
            </span>
            <select
              value={selection.fontVarName}
              onChange={(e) => onFontChange(e.target.value)}
              className="w-full rounded-md border border-ink/15 bg-paper px-2 py-1.5 text-sm text-ink"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.varName} value={f.varName}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-2">
            <label className="flex-1">
              <span className="mb-1 block font-[family-name:var(--font-quicksand)] text-xs font-semibold text-ink/60">
                Size
              </span>
              <input
                type="number"
                min={8}
                max={200}
                value={selection.fontSize ?? 28}
                onChange={(e) => onFontSizeChange(Number(e.target.value) || 28)}
                className="w-full rounded-md border border-ink/15 bg-paper px-2 py-1.5 text-sm text-ink"
              />
            </label>
            <label>
              <span className="mb-1 block font-[family-name:var(--font-quicksand)] text-xs font-semibold text-ink/60">
                Color
              </span>
              <input
                type="color"
                value={selection.fill ?? "#3a312b"}
                onChange={(e) => onColorChange(e.target.value)}
                className="h-9 w-10 cursor-pointer rounded-md border border-ink/15 bg-paper"
              />
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onToggleBold}
              className={cn(
                "flex-1 rounded-md border px-2 py-1.5 font-bold text-sm",
                selection.bold
                  ? "border-rose bg-rose/10 text-rose"
                  : "border-ink/15 text-ink/70 hover:border-ink/30",
              )}
            >
              B
            </button>
            <button
              onClick={onToggleItalic}
              className={cn(
                "flex-1 rounded-md border px-2 py-1.5 text-sm italic",
                selection.italic
                  ? "border-rose bg-rose/10 text-rose"
                  : "border-ink/15 text-ink/70 hover:border-ink/30",
              )}
            >
              I
            </button>
          </div>
        </div>
      )}

      {selection.kind === "image" && !selection.isMulti && (
        <button
          onClick={onConvertToPolaroid}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-md border border-ink/15 px-2 py-2 font-[family-name:var(--font-quicksand)] text-sm font-semibold text-ink/70 hover:border-rose hover:text-rose"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          Convert to Polaroid
        </button>
      )}

      <div className="grid grid-cols-4 gap-2 border-t border-ink/10 pt-3">
        <IconAction icon={Copy} label="Duplicate" onClick={onDuplicate} />
        <IconAction
          icon={selection.locked ? Unlock : Lock}
          label={selection.locked ? "Unlock" : "Lock"}
          onClick={onToggleLock}
        />
        <IconAction icon={BringToFront} label="Forward" onClick={onBringForward} />
        <IconAction icon={SendToBack} label="Backward" onClick={onSendBackward} />
      </div>

      <div className="mt-2 grid grid-cols-4 gap-2">
        {selection.isMulti && !selection.isGroupObject && (
          <IconAction icon={GroupIcon} label="Group" onClick={onGroup} />
        )}
        {selection.isGroupObject && (
          <IconAction icon={Ungroup} label="Ungroup" onClick={onUngroup} />
        )}
        <IconAction icon={Trash2} label="Delete" onClick={onDelete} danger />
      </div>
    </div>
  );
}

function IconAction({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "flex h-9 w-full items-center justify-center rounded-md border border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink",
        danger && "hover:border-rose hover:bg-rose/10 hover:text-rose",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
