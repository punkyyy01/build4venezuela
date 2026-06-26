"use client";

import { Show, SignInButton } from "@clerk/nextjs";

const ctaClassName =
  "inline-flex border border-primary bg-primary px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-primary/80";

export function SubmitProjectCta() {
  return (
    <>
      <Show when="signed-in">
        <a className={ctaClassName} href="/submit">
          Submit yours
        </a>
      </Show>
      <Show when="signed-out">
        <SignInButton
          forceRedirectUrl="/submit"
          mode="modal"
          signUpForceRedirectUrl="/submit"
        >
          <button className={ctaClassName} type="button">
            Submit yours
          </button>
        </SignInButton>
      </Show>
    </>
  );
}
