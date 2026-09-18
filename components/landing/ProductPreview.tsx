import { Polaroid } from "@/components/ui/Polaroid";
import { WashiTape } from "@/components/ui/WashiTape";

export function ProductPreview() {
  return (
    <section className="relative px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic text-ink sm:text-4xl">
          Not a template. A page they&apos;ll actually keep open.
        </h2>
        <p className="mt-3 font-[family-name:var(--font-nunito)] text-ink/60">
          Layered paper, taped photos, and a note in your own handwriting.
        </p>
      </div>

      <div className="relative mx-auto mt-14 max-w-4xl rounded-2xl border border-ink/10 bg-kraft/20 p-8 paper-shadow sm:p-14">
        <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-10">
          <Polaroid tapeColor="rose" rotate={-6} caption="our first trip" />
          <Polaroid
            tapeColor="sage"
            rotate={4}
            caption="happy monthsary"
            className="sm:mt-8"
          />
          <Polaroid tapeColor="lavender" rotate={-3} caption="i still smile at this" />
        </div>
        <div className="relative mx-auto mt-10 max-w-md rotate-1 rounded-sm bg-paper p-6 paper-shadow torn-edge-bottom pb-10">
          <WashiTape color="kraft" rotate={-6} className="left-6 -top-3" />
          <p className="font-[family-name:var(--font-indie-flower)] text-lg leading-relaxed text-ink/80">
            Dear you, I wanted to make something that felt like us — a little
            messy, a little handmade, and full of everything I&apos;d never
            fit into a text...
          </p>
        </div>
        <p className="mt-8 text-center font-[family-name:var(--font-caveat)] text-2xl text-rose">
          &ldquo;I can make this for someone.&rdquo;
        </p>
      </div>
    </section>
  );
}
