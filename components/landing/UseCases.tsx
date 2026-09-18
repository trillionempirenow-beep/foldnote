const groups = [
  {
    title: "For Someone You Love",
    tint: "border-rose/30 bg-rose/5",
    items: ["Anniversary", "Monthsary", "Confession", "Long-distance"],
  },
  {
    title: "For Friends",
    tint: "border-sage/30 bg-sage/5",
    items: ["Birthday", "Graduation", "Thank You"],
  },
  {
    title: "For Family",
    tint: "border-lavender/30 bg-lavender/5",
    items: ["Memory Book", "Celebration", "Tribute"],
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic text-ink sm:text-4xl">
          Made for every kind of memory.
        </h2>
      </div>
      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
        {groups.map((g) => (
          <div
            key={g.title}
            className={`rounded-lg border-2 border-dashed p-6 ${g.tint}`}
          >
            <h3 className="font-[family-name:var(--font-caveat)] text-2xl text-ink">
              {g.title}
            </h3>
            <ul className="mt-4 space-y-2 font-[family-name:var(--font-nunito)] text-sm text-ink/70">
              {g.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-rose">✦</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
