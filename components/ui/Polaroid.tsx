import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { WashiTape } from "./WashiTape";

const swatchClasses = {
  rose: "bg-gradient-to-br from-rose/40 to-rose/70",
  sage: "bg-gradient-to-br from-sage/40 to-sage/70",
  lavender: "bg-gradient-to-br from-lavender/40 to-lavender/70",
  kraft: "bg-gradient-to-br from-kraft/50 to-kraft/80",
} as const;

export function Polaroid({
  src,
  alt = "",
  caption,
  rotate = -3,
  className,
  tapeColor = "rose",
  width = 220,
  height = 260,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  rotate?: number;
  className?: string;
  tapeColor?: "rose" | "sage" | "lavender" | "kraft";
  width?: number;
  height?: number;
}) {
  return (
    <div
      className={cn(
        "relative bg-white p-3 pb-6 paper-shadow rounded-[2px]",
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)`, width }}
    >
      <WashiTape
        color={tapeColor}
        rotate={rotate + 4}
        className="left-1/2 -top-3 -translate-x-1/2"
      />
      <div
        className={cn(
          "relative w-full overflow-hidden",
          !src && swatchClasses[tapeColor],
        )}
        style={{ height: height - 60 }}
      >
        {src && (
          <Image src={src} alt={alt} fill className="object-cover" sizes="220px" />
        )}
      </div>
      {caption && (
        <p className="mt-3 text-center text-ink/80 font-[family-name:var(--font-caveat)] text-lg leading-none">
          {caption}
        </p>
      )}
    </div>
  );
}
