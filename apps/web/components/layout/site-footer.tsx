import Link from "next/link";

import { navigationItems } from "@/lib/site-data";

import { BrandMark } from "./brand-mark";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="section-divider mt-24">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <BrandMark className="h-11 w-11" />
              <div>
                <p className="font-display text-[1.65rem] leading-none tracking-[-0.03em]">BirdLens</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Deep Learning for Indian Bird Detection
                </p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
              A refined interface for visual and acoustic bird identification, built to bridge
              deep-learning research with a calm, field-ready user experience.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                Navigate
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-[var(--color-text)] hover:text-[var(--color-forest)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                Project
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
                <p>Image and audio detection flows designed for serious birding use cases.</p>
                <p>Datasets and models are managed alongside the BirdLens research repository.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
