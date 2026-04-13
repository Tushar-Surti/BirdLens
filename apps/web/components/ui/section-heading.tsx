import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-4",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="h-px w-10 bg-[rgba(183,152,102,0.8)]" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-olive)]">
          {eyebrow}
        </p>
      </div>
      <h2 className="font-display text-4xl leading-none tracking-[-0.03em] text-[var(--color-text)] sm:text-5xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)] sm:text-lg">
        {description}
      </p>
    </div>
  );
}
