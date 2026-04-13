"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { navigationItems } from "@/lib/site-data";
import { cn } from "@/lib/utils";

import { BrandMark } from "./brand-mark";
import { Container } from "./container";
import { buttonVariants } from "../ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.35
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 18);
  });

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md",
        isScrolled
          ? "border-[rgba(27,39,33,0.1)] bg-[rgba(248,243,235,0.94)] shadow-[0_14px_30px_rgba(24,33,29,0.08)]"
          : "border-[rgba(27,39,33,0.06)] bg-[rgba(248,243,235,0.72)]"
      )}
    >
      <Container className="py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-[var(--color-text)]"
            onClick={() => setIsOpen(false)}
          >
            <BrandMark />
            <div>
              <p className="font-display text-[1.5rem] leading-none tracking-[-0.03em]">BirdLens</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
                Indian Bird Detection
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && item.href !== "/#about" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm tracking-[-0.01em] text-[var(--color-muted)] hover:text-[var(--color-text)]",
                    isActive && "text-[var(--color-text)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/detect" className={buttonVariants({ variant: "secondary", size: "sm" })}>
              Explore Modes
            </Link>
            <Link href="/detect/image" className={buttonVariants({ size: "sm" })}>
              Start Detection
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.6)] text-[var(--color-text)] lg:hidden"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {isOpen ? (
          <motion.div
            className="mt-4 rounded-[24px] border border-[var(--color-border)] bg-[rgba(255,255,255,0.74)] p-4 shadow-[var(--shadow-card)] lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-sm text-[var(--color-text)] hover:bg-[rgba(23,52,42,0.05)]"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/detect"
                className={buttonVariants({ variant: "secondary" })}
                onClick={() => setIsOpen(false)}
              >
                Explore Modes
              </Link>
              <Link
                href="/detect/image"
                className={buttonVariants({})}
                onClick={() => setIsOpen(false)}
              >
                Start Detection
              </Link>
            </div>
          </motion.div>
        ) : null}
      </Container>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[rgba(183,152,102,0.78)]"
        style={{ scaleX: progressScaleX }}
      />
    </motion.header>
  );
}
