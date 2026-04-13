import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <div
      className={cn(
        "relative h-10 w-10 overflow-hidden rounded-[14px] bg-[var(--color-forest)] shadow-[0_10px_24px_rgba(23,52,42,0.18)]",
        className
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 40 40"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="14" fill="#17342A" />
        <circle cx="20" cy="20" r="10.5" stroke="#D5C3A0" strokeWidth="1.4" />
        <path
          d="M15.5 22.8C18.2 23.2 21.8 21.9 24.3 18.1C21.6 18.5 19.3 17.7 17.8 15.7C18.2 19.2 17.2 21.3 15.5 22.8Z"
          fill="#F8F3EA"
        />
        <path
          d="M24.2 18.2C26 18 27.5 18.4 28.8 19.5"
          stroke="#D5C3A0"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
