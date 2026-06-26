import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import messages from "../../../messages/en.json";

export default function ProjectRoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
