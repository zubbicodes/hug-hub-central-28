import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { formatProductPrice } from "@/lib/shopify/format";
import type { ShopifyProduct } from "@/lib/shopify/types";

import { AddToCartButton } from "./AddToCartButton";

type ProductCardProps = {
  product: ShopifyProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const firstAvailableVariant =
    product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];

  return (
    <article className="group flex min-h-[420px] flex-col border border-rule bg-surface transition-colors hover:border-accent/50">
      <Link to="/products/$handle" params={{ handle: product.handle }} className="block">
        <div className="relative aspect-square overflow-hidden bg-[oklch(0.96_0.005_250)]">
          {product.featuredImage ? (
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              loading="lazy"
              className="h-full w-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
              Image Pending
            </div>
          )}
          <div className="absolute left-4 top-4 bg-charcoal-deep px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/70">
            {product.productType || product.vendor || "Spares"}
          </div>
          <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center bg-charcoal-deep text-accent opacity-0 transition-opacity group-hover:opacity-100">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to="/products/$handle" params={{ handle: product.handle }} className="block">
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-muted">
            {product.vendor || "Spares Automation"}
          </div>
          <h3 className="mt-2 font-display text-[16px] font-bold uppercase leading-tight tracking-tight text-ink transition-colors group-hover:text-accent">
            {product.title}
          </h3>
        </Link>
        <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-ink-muted">
          {product.description || "OEM-grade industrial spare available through Shopify inventory."}
        </p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-muted">
              Trade Price
            </div>
            <div className="mt-1 font-display text-lg font-bold text-ink">
              {formatProductPrice(product)}
            </div>
          </div>
          <AddToCartButton
            variantId={firstAvailableVariant?.id ?? ""}
            disabled={!firstAvailableVariant || !product.availableForSale}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 bg-charcoal px-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.availableForSale ? "Add" : "Sold Out"}
          </AddToCartButton>
        </div>
      </div>
    </article>
  );
}
