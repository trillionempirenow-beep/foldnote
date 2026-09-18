const steps = [
  "Pick a paper style.",
  "Add photos.",
  "Write memories.",
  "Decorate with stickers.",
  "Seal Your Pages.",
  "Share one link.",
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic text-ink sm:text-4xl">
          How it works
        </h2>
      </div>
      <ol className="mx-auto mt-14 flex max-w-4xl flex-wrap justify-center gap-8">
        {steps.map((step, i) => (
          <li
            key={step}
            className="flex w-40 flex-col items-center text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-rose/50 font-[family-name:var(--font-caveat)] text-2xl text-rose">
              {i + 1}
            </span>
            <p className="mt-3 font-[family-name:var(--font-patrick-hand)] text-ink/80">
              {step}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
