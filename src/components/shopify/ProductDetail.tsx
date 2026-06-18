import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";

import { AddToCartButton } from "@/components/shopify/AddToCartButton";
import { SiteHeader } from "@/components/shopify/SiteHeader";
import { formatMoney } from "@/lib/shopify/format";
import type { ShopifyProduct } from "@/lib/shopify/types";

type ProductDetailProps = {
  product: ShopifyProduct;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.find((variant) => variant.availableForSale)?.id ?? product.variants[0]?.id,
  );
  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0];
  const gallery = product.images.length
    ? product.images
    : product.featuredImage
      ? [product.featuredImage]
      : [];
  const [activeImage, setActiveImage] = useState(gallery[0]);

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />

      <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-px bg-rule lg:grid-cols-2">
        <section className="bg-surface p-6 lg:p-10">
          <Link
            to="/products"
            className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Catalogue
          </Link>

          <div className="aspect-square overflow-hidden bg-[oklch(0.96_0.005_250)]">
            {activeImage ? (
              <img
                src={activeImage.url}
                alt={activeImage.altText ?? product.title}
                className="h-full w-full object-cover mix-blend-multiply"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
                Image Pending
              </div>
            )}
          </div>

          {gallery.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((image) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className="aspect-square overflow-hidden border border-rule bg-background transition-colors hover:border-accent"
                >
                  <img
                    src={image.url}
                    alt={image.altText ?? product.title}
                    className="h-full w-full object-cover mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <section className="bg-surface p-6 lg:p-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
            {product.vendor || "Spares Automation"} / {product.productType || "Industrial Part"}
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,4.8rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-ink">
            {product.title}
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="font-display text-3xl font-bold text-ink">
              {selectedVariant ? formatMoney(selectedVariant.price) : "Price on request"}
            </div>
            {selectedVariant?.compareAtPrice ? (
              <div className="font-mono text-sm uppercase tracking-[0.18em] text-ink-muted line-through">
                {formatMoney(selectedVariant.compareAtPrice)}
              </div>
            ) : null}
          </div>

          <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
            {product.description ||
              "OEM-grade spare part supplied through Shopify-managed inventory."}
          </p>

          {product.variants.length > 1 ? (
            <div className="mt-10">
              <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
                Variant
              </label>
              <select
                value={selectedVariantId}
                onChange={(event) => setSelectedVariantId(event.target.value)}
                className="mt-3 h-12 w-full border border-rule bg-background px-4 font-mono text-sm text-ink focus:border-accent focus:outline-none"
              >
                {product.variants.map((variant) => (
                  <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>
                    {variant.title} {variant.availableForSale ? "" : "(Sold out)"}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton
              variantId={selectedVariant?.id ?? ""}
              disabled={!selectedVariant?.availableForSale}
              className="inline-flex h-13 items-center justify-center gap-2 bg-accent px-8 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {selectedVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
            </AddToCartButton>
            <Link
              to="/cart"
              className="inline-flex h-13 items-center justify-center border border-rule px-8 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              View Cart
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px bg-rule sm:grid-cols-3">
            {[
              { icon: Truck, title: "UK Dispatch", copy: "Shopify managed checkout" },
              { icon: ShieldCheck, title: "Warranty", copy: "Trade support included" },
              { icon: PackageCheck, title: "Inventory", copy: "Live availability" },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="bg-background p-5">
                <Icon className="h-5 w-5 text-accent" />
                <div className="mt-4 font-display text-[13px] font-bold uppercase tracking-tight">
                  {title}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  {copy}
                </div>
              </div>
            ))}
          </div>

          {product.tags.length ? (
            <div className="mt-10 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 border border-rule px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted"
                >
                  <CheckCircle2 className="h-3 w-3 text-accent" />
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
