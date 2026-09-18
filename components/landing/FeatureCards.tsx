import {
  Image as ImageIcon,
  PenLine,
  Sparkles,
  Music,
  MessageCircleHeart,
  BookOpen,
} from "lucide-react";

const features = [
  {
    icon: ImageIcon,
    title: "Photos Anywhere",
    body: "Place memories wherever your heart wants.",
    tint: "bg-rose/15",
    rotate: "-rotate-2",
  },
  {
    icon: PenLine,
    title: "Handwritten Letters",
    body: "Write naturally with beautiful fonts.",
    tint: "bg-sage/15",
    rotate: "rotate-1",
  },
  {
    icon: Sparkles,
    title: "Cute Stickers",
    body: "Decorate every page.",
    tint: "bg-lavender/15",
    rotate: "-rotate-1",
  },
  {
    icon: Music,
    title: "Music",
    body: "Let one song tell the story.",
    tint: "bg-kraft/25",
    rotate: "rotate-2",
  },
  {
    icon: MessageCircleHeart,
    title: "Visitor Notes",
    body: "Let loved ones leave something behind.",
    tint: "bg-rose/15",
    rotate: "rotate-1",
  },
  {
    icon: BookOpen,
    title: "Paper Flip Experience",
    body: "Every new page feels like turning a real scrapbook.",
    tint: "bg-sage/15",
    rotate: "-rotate-2",
  },
];

export function FeatureCards() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic text-ink sm:text-4xl">
          More than a website.
        </h2>
      </div>
      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className={`${f.rotate} ${f.tint} rounded-lg border border-ink/10 p-6 paper-shadow transition-transform hover:rotate-0`}
          >
            <f.icon className="h-7 w-7 text-ink/70" strokeWidth={1.5} />
            <h3 className="mt-4 font-[family-name:var(--font-patrick-hand)] text-xl text-ink">
              {f.title}
            </h3>
            <p className="mt-1 font-[family-name:var(--font-nunito)] text-sm text-ink/60">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
