import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

export function ProjectShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="pt-16">{children}</div>
      <footer className="px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl border-border border-t pt-8">
          <p className="font-mono text-xs uppercase leading-6 tracking-[0.2em] text-muted-foreground">
            Build projects for Venezuelans. Share the work, vote for momentum,
            keep shipping.
          </p>
        </div>
      </footer>
    </main>
  );
}
