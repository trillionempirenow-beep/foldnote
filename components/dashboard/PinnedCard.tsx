import Link from "next/link";
import { Pin } from "lucide-react";

const tints = ["bg-rose/10", "bg-sage/10", "bg-lavender/10", "bg-kraft/20"];

export function PinnedCard({
  id,
  title,
  status,
  updatedAt,
  index,
}: {
  id: string;
  title: string;
  status: "draft" | "published";
  updatedAt: string;
  index: number;
}) {
  const rotate = index % 2 === 0 ? "-rotate-1" : "rotate-1";
  const tint = tints[index % tints.length];

  return (
    <Link
      href={`/editor/${id}`}
      className={`group relative block rounded-sm border border-ink/10 p-5 pt-7 paper-shadow transition-transform hover:-translate-y-1 hover:rotate-0 ${tint} ${rotate}`}
    >
      <Pin
        className="absolute left-1/2 top-2 h-4 w-4 -translate-x-1/2 text-ink/40"
        strokeWidth={2}
      />
      <div className="mb-3 aspect-[4/3] w-full rounded-sm bg-white/60" />
      <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg text-ink">
        {title}
      </h3>
      <div className="mt-2 flex items-center justify-between font-[family-name:var(--font-nunito)] text-xs text-ink/50">
        <span>
          {new Date(updatedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 ${
            status === "published"
              ? "bg-sage/30 text-ink/70"
              : "bg-ink/10 text-ink/60"
          }`}
        >
          {status === "published" ? "Sealed" : "Draft"}
        </span>
      </div>
    </Link>
  );
}
