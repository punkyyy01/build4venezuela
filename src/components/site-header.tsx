import { getTranslations } from "next-intl/server";
import { LanguageSelector } from "@/components/language-selector";
import { Link } from "@/i18n/navigation";

export async function SiteHeader() {
  const t = await getTranslations("Header");

  return (
    <header className="fixed inset-x-0 top-0 isolate z-40 border-border border-b bg-background/95 px-4 py-3 shadow-xl backdrop-blur sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <Link
          className="font-mono text-sm font-black uppercase leading-none tracking-[0.18em] text-foreground transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:text-base"
          href="/"
        >
          <span className="sm:hidden">{t("mobileBrand")}</span>
          <span className="hidden sm:inline">{t("brand")}</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <nav aria-label={t("navigationLabel")}>
            <Link
              className="inline-flex border border-border px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-foreground transition hover:border-foreground hover:bg-foreground hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:px-4"
              href="/brand"
            >
              {t("brandPageLink")}
            </Link>
          </nav>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
