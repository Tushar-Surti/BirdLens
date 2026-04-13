"use client";

import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import type { ReactNode } from "react";
import { useEffect } from "react";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      duration: 1.15,
      lerp: 0.08,
      wheelMultiplier: 0.95,
      touchMultiplier: 1,
      anchors: {
        offset: -96
      }
    });

    return () => {
      lenis.destroy();
    };
  }, [reduceMotion]);

  return <>{children}</>;
}
