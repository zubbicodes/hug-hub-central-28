import { Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

export function CustomerAuthState({
  title,
  label,
  missing,
  error,
}: {
  title: string;
  label: string;
  missing: string[];
  error: string;
}) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-116px)] max-w-[900px] items-center px-6 py-16">
      <section className="w-full border border-rule bg-surface p-8 md:p-10">
        <div className="mb-6 flex h-12 w-12 items-center justify-center bg-accent text-accent-foreground">
          {missing.length || error ? (
            <ShieldCheck className="h-5 w-5" />
          ) : (
            <Loader2 className="h-5 w-5 animate-spin" />
          )}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
          {label}
        </div>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight">
          {title}
        </h1>

        {missing.length ? (
          <>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-muted">
              Add these Customer Account API environment variables, then restart the site. Get them
              from Shopify Admin under Headless, then Customer Account API.
            </p>
            <div className="mt-6 border border-rule bg-background p-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
              {missing.map((name) => (
                <div key={name} className="py-1">
                  {name}
                </div>
              ))}
            </div>
          </>
        ) : error ? (
          <p className="mt-5 text-sm leading-relaxed text-ink-muted">{error}</p>
        ) : (
          <p className="mt-5 text-sm leading-relaxed text-ink-muted">
            Redirecting you to Shopify secure customer accounts.
          </p>
        )}

        <Link
          to="/products"
          className="mt-8 inline-flex h-11 items-center gap-2 border border-rule px-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" /> Back to catalogue
        </Link>
      </section>
    </main>
  );
}
