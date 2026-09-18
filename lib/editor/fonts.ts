export const FONT_OPTIONS = [
  { label: "Caveat", varName: "--font-caveat" },
  { label: "Patrick Hand", varName: "--font-patrick-hand" },
  { label: "Indie Flower", varName: "--font-indie-flower" },
  { label: "Quicksand", varName: "--font-quicksand" },
  { label: "Nunito", varName: "--font-nunito" },
  { label: "Playfair Display", varName: "--font-playfair-display" },
] as const;

export type FontVarName = (typeof FONT_OPTIONS)[number]["varName"];

/**
 * next/font/google writes the resolved (hashed) font-family stack into a CSS
 * custom property on <html>. Canvas 2D's `ctx.font` shorthand can't resolve
 * var(...) the way element CSS can, so we read the custom property's literal
 * value at runtime and hand Fabric that resolved string directly.
 */
export function resolveFontFamily(varName: string): string {
  if (typeof window === "undefined") return "sans-serif";
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return value || "sans-serif";
}

export const DEFAULT_FONT_VAR: FontVarName = "--font-patrick-hand";
