import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScrollProvider } from "@/components/layout/smooth-scroll-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "BirdLens | Indian Bird Species Detection",
  description:
    "Premium multimodal bird species detection for Indian birds using image and audio inputs.",
  applicationName: "BirdLens"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="page-shell">
        <SmoothScrollProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
