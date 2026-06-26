import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";
import { QueryProvider } from "./query-provider";

const inputMonoNarrow = localFont({
  src: [
    {
      path: "../../public/BFV/fonts/InputMonoNarrow-Light-Testing.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/BFV/fonts/InputMonoNarrow-LightItalic-Testing.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/BFV/fonts/InputMonoNarrow-Regular-Testing.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/BFV/fonts/InputMonoNarrow-Italic-Testing.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/BFV/fonts/InputMonoNarrow-Medium-Testing.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/BFV/fonts/InputMonoNarrow-MediumItalic-Testing.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/BFV/fonts/InputMonoNarrow-Bold-Testing.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/BFV/fonts/InputMonoNarrow-BoldItalic-Testing.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/BFV/fonts/InputMonoNarrow-Black-Testing.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/BFV/fonts/InputMonoNarrow-BlackItalic-Testing.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  display: "swap",
  fallback: ["monospace"],
  variable: "--font-input-mono-narrow",
});

export const metadata: Metadata = {
  title: "Build4Venezuela",
  description: "Build projects for Venezuelans.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inputMonoNarrow.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ClerkProvider appearance={{ theme: shadcn }}>
          <QueryProvider>{children}</QueryProvider>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}
