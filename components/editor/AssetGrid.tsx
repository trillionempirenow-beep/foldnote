"use client";

export function AssetGrid<T extends { id: string; name: string; asset_url: string }>({
  title,
  groups,
  onPick,
  itemClassName,
  columns = 4,
}: {
  title: string;
  groups: { label: string; items: T[] }[];
  onPick: (item: T) => void;
  itemClassName?: string;
  columns?: 2 | 4;
}) {
  return (
    <div className="paper-shadow absolute bottom-4 left-[92px] z-20 max-h-[70vh] w-72 -rotate-[0.2deg] overflow-y-auto rounded-xl border border-ink/10 bg-white/95 p-4 backdrop-blur">
      <p className="mb-3 font-[family-name:var(--font-patrick-hand)] text-base text-ink/60">
        {title}
      </p>
      {groups.length === 0 ? (
        <p className="px-1 py-6 text-center font-[family-name:var(--font-nunito)] text-xs text-ink/40">
          Loading...
        </p>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 font-[family-name:var(--font-quicksand)] text-xs font-semibold uppercase tracking-wide text-ink/40">
                {group.label}
              </p>
              <div className={columns === 2 ? "grid grid-cols-2 gap-2" : "grid grid-cols-4 gap-2"}>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onPick(item)}
                    title={item.name}
                    className={
                      itemClassName ??
                      "flex h-14 items-center justify-center rounded-lg border border-ink/10 bg-paper p-1.5 transition-transform hover:-translate-y-0.5 hover:border-rose/40"
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.asset_url}
                      alt={item.name}
                      className="h-full w-full object-contain"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
