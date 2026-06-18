import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { SiteHeader } from "@/components/shopify/SiteHeader";
import { finishCustomerAuth } from "@/lib/api/customer-account.functions";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function completeLogin() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const shopifyError = params.get("error_description") ?? params.get("error");

      if (shopifyError) {
        setError(shopifyError);
        return;
      }

      if (!code || !state) {
        setError("Shopify did not return the customer login code.");
        return;
      }

      try {
        const result = await finishCustomerAuth({ data: { code, state } });
        if (!mounted) return;
        if (result.ok) {
          window.location.href = "/account";
          return;
        }
        setError(
          "error" in result
            ? (result.error ?? "Shopify could not complete this customer login.")
            : `Missing env: ${result.missing.join(", ")}`,
        );
      } catch {
        if (mounted) setError("Customer login could not be completed.");
      }
    }

    completeLogin();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-116px)] max-w-[760px] items-center px-6 py-16">
        <section className="w-full border border-rule bg-surface p-8 text-center md:p-10">
          {error ? (
            <>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
                Shopify Customer Account
              </div>
              <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight">
                Login could not finish
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
                {error}
              </p>
              <Link
                to="/login"
                className="mt-8 inline-flex h-11 items-center justify-center bg-accent px-5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Try again
              </Link>
            </>
          ) : (
            <>
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
              <h1 className="mt-6 font-display text-3xl font-extrabold uppercase tracking-tight">
                Completing secure login
              </h1>
              <p className="mt-4 text-sm text-ink-muted">Connecting your Shopify customer account.</p>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
