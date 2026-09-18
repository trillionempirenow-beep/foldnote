"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Polaroid } from "@/components/ui/Polaroid";
import { WashiTape } from "@/components/ui/WashiTape";

const float = (delay: number) => ({
  animate: { y: [0, -10, 0] },
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const, delay },
});

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-10 pb-24 sm:px-10">
      {/* floating decorative pieces */}
      <motion.div
        className="pointer-events-none absolute left-[6%] top-[18%] hidden sm:block"
        {...float(0)}
      >
        <Polaroid tapeColor="sage" rotate={-8} width={140} height={170} />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-[8%] top-[10%] hidden sm:block"
        {...float(1.2)}
      >
        <Polaroid tapeColor="lavender" rotate={6} width={150} height={180} />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-[14%] bottom-[8%] hidden md:block"
        {...float(2.1)}
      >
        <WashiTape color="rose" rotate={-12} className="h-8 w-24" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute left-[12%] bottom-[14%] hidden md:block text-4xl"
        {...float(0.6)}
        aria-hidden
      >
        🌸
      </motion.div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="mb-4 font-[family-name:var(--font-patrick-hand)] text-lg text-rose">
          a digital scrapbook surprise creator
        </p>
        <h1 className="font-[family-name:var(--font-caveat)] text-5xl leading-tight text-ink sm:text-7xl">
          Some feelings deserve more than a chat message.
        </h1>
        <p className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-nunito)] text-base text-ink/70 sm:text-lg">
          Turn your memories into a beautiful scrapbook surprise with photos,
          letters, music, stickers, and messages — all shareable with a
          single link.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/signup" variant="primary">
            Begin Your Pages
          </Button>
          <Button href="#how-it-works" variant="secondary">
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
