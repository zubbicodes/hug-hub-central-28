import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "@/components/shopify/ProductCard";
import { SiteHeader } from "@/components/shopify/SiteHeader";
import type { ShopifyCollection, ShopifyProduct } from "@/lib/shopify/types";

type CollectionPageProps = {
  eyebrow: string;
  title: string;
  accent?: "accent" | "amber";
  image: string;
  imageAlt: string;
  intro: string;
  collection: ShopifyCollection | null;
  fallbackProducts?: ShopifyProduct[];
  expectedHandle: string;
};

export function CollectionPage({
  eyebrow,
  title,
  accent = "accent",
  image,
  imageAlt,
  intro,
  collection,
  fallbackProducts = [],
  expectedHandle,
}: CollectionPageProps) {
  const products = collection?.products ?? fallbackProducts;
  const accentClass = accent === "amber" ? "text-amber" : "text-accent";
  const bgAccentClass = accent === "amber" ? "bg-amber" : "bg-accent";

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />

      <section className="relative flex h-[58vh] min-h-[420px] w-full items-end overflow-hidden">
        <img
          src={collection?.image?.url ?? image}
          alt={collection?.image?.altText ?? imageAlt}
          className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-charcoal-deep/65 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1600px] px-10 pb-20">
          <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
            <span className={`h-px w-8 ${bgAccentClass}`} />
            {eyebrow}
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-white">
            {title}{" "}
            <span className={accentClass}>{collection?.title ? "CATALOGUE" : "SPARES"}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-white/60">
            {collection?.description || intro}
          </p>
        </div>
      </section>

      <section className="border-b border-rule bg-surface">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-7 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
              Shopify Collection
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight">
              {collection?.title ?? expectedHandle}
            </h2>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to overview
          </Link>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="mx-auto max-w-[1600px] px-6">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-rule bg-surface px-8 py-16 text-center">
              <div
                className={`mx-auto mb-6 flex h-12 w-12 items-center justify-center ${bgAccentClass} text-accent-foreground`}
              >
                <ChevronRight className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight">
                No Shopify products found
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted">
                Create a Shopify collection with handle{" "}
                <span className="font-mono text-ink">{expectedHandle}</span>, add active products,
                and publish them to the Headless sales channel. They will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
