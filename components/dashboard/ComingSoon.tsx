export function ComingSoon({
  title,
  note,
}: {
  title: string;
  note: string;
}) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center px-8 text-center">
      <p className="font-[family-name:var(--font-caveat)] text-4xl text-ink">
        {title}
      </p>
      <p className="mt-3 max-w-sm font-[family-name:var(--font-nunito)] text-sm text-ink/60">
        {note}
      </p>
    </div>
  );
}
