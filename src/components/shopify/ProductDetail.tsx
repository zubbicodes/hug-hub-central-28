import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  FileText,
  HelpCircle,
  Mail,
  MessageCircle,
  Minus,
  PackageCheck,
  PlayCircle,
  Plus,
} from "lucide-react";
import { useState } from "react";

import { AddToCartButton } from "@/components/shopify/AddToCartButton";
import { SiteFooter } from "@/components/shopify/SiteFooter";
import { SiteHeader } from "@/components/shopify/SiteHeader";
import { formatMoney } from "@/lib/shopify/format";
import type { ShopifyProduct, ShopifyVariant } from "@/lib/shopify/types";
import { productQuestionMailto, productQuestionWhatsApp, productQuoteMailto } from "@/lib/quote";

type ProductDetailProps = {
  product: ShopifyProduct;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.find((variant) => variant.availableForSale)?.id ?? product.variants[0]?.id,
  );
  const [quantity, setQuantity] = useState(1);
  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0];
  const gallery = product.images.length
    ? product.images
    : product.featuredImage
      ? [product.featuredImage]
      : [];
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const brand = product.technicalDetails.brand ?? product.vendor ?? "Spares Automation";
  const mpnRange = product.technicalDetails.mpnRange ?? selectedVariant?.sku ?? "Ask for MPN";

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-[1600px]">
        <div className="border-b border-rule bg-surface px-4 py-4 md:px-6 lg:px-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Catalogue
          </Link>
        </div>

        <section className="grid grid-cols-1 gap-px bg-rule lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <ProductGallery
            productTitle={product.title}
            gallery={gallery}
            activeImage={activeImage}
            onSelectImage={setActiveImage}
          />

          <section className="bg-surface p-4 md:p-8 lg:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="border border-rule bg-background px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                {brand}
              </span>
              <StockBadge variant={selectedVariant} product={product} />
            </div>

            <h1 className="mt-4 max-w-3xl break-words font-display text-[1.55rem] font-extrabold uppercase leading-[1.08] tracking-normal text-ink sm:text-[1.85rem] md:mt-5 md:text-[2.45rem] lg:text-[3.15rem]">
              {product.title}
            </h1>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <SpecBlock label="Brand" value={brand} />
              <SpecBlock label="MPN / Range" value={mpnRange} />
              <SpecBlock label="Product line" value={product.productType || "Industrial part"} />
            </div>

            <div className="mt-8 flex flex-wrap items-end gap-x-5 gap-y-2">
              <div className="font-display text-3xl font-bold text-ink">
                {selectedVariant ? formatMoney(selectedVariant.price) : "Price on request"}
              </div>
              {selectedVariant?.compareAtPrice ? (
                <div className="pb-1 font-mono text-sm uppercase tracking-[0.18em] text-ink-muted line-through">
                  {formatMoney(selectedVariant.compareAtPrice)}
                </div>
              ) : null}
            </div>

            <ProductDescription product={product} />

            {product.variants.length > 1 ? (
              <div className="mt-8">
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
                      {variant.title} {variant.sku ? `- ${variant.sku}` : ""}{" "}
                      {variant.availableForSale ? "" : "(Sold out)"}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="mt-8 space-y-3">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                disabled={!selectedVariant?.availableForSale}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <AddToCartButton
                  variantId={selectedVariant?.id ?? ""}
                  quantity={quantity}
                  disabled={!selectedVariant?.availableForSale}
                  className="inline-flex h-13 items-center justify-center gap-2 bg-accent px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {selectedVariant?.availableForSale ? "Add to Cart" : "Sold out"}
                </AddToCartButton>
                <a
                  href={productQuoteMailto(product, selectedVariant, quantity)}
                  className="inline-flex h-13 items-center justify-center gap-2 border border-accent bg-accent/5 px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <FileText className="h-4 w-4" />
                  Add to my quotes
                </a>
                <Link
                  to="/cart"
                  className="inline-flex h-13 items-center justify-center border border-rule px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  View Cart
                </Link>
              </div>
            </div>

            <ProductResources product={product} />
            <QuestionActions product={product} variant={selectedVariant} />
          </section>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function QuantityStepper({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const decrease = () => onChange(Math.max(1, value - 1));
  const increase = () => onChange(Math.min(99, value + 1));

  return (
    <div className="flex h-13 w-full items-stretch border border-rule bg-surface sm:w-[210px]">
      <div className="flex min-w-[52px] items-center justify-center border-r border-rule font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
        Qty
      </div>
      <button
        type="button"
        onClick={decrease}
        disabled={disabled || value <= 1}
        className="flex w-11 items-center justify-center text-ink transition-colors hover:bg-background hover:text-accent disabled:cursor-not-allowed disabled:text-ink-muted/35"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        value={value}
        onChange={(event) => {
          const nextValue = Number.parseInt(event.target.value, 10);
          if (Number.isNaN(nextValue)) {
            onChange(1);
            return;
          }
          onChange(Math.min(99, Math.max(1, nextValue)));
        }}
        disabled={disabled}
        inputMode="numeric"
        aria-label="Quantity"
        className="w-12 border-x border-rule bg-transparent text-center font-display text-base font-bold text-ink focus:outline-none disabled:text-ink-muted"
      />
      <button
        type="button"
        onClick={increase}
        disabled={disabled || value >= 99}
        className="flex w-11 items-center justify-center text-ink transition-colors hover:bg-background hover:text-accent disabled:cursor-not-allowed disabled:text-ink-muted/35"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function ProductGallery({
  productTitle,
  gallery,
  activeImage,
  onSelectImage,
}: {
  productTitle: string;
  gallery: ShopifyProduct["images"];
  activeImage: ShopifyProduct["images"][number] | undefined;
  onSelectImage: (image: ShopifyProduct["images"][number]) => void;
}) {
  return (
    <section className="bg-surface p-4 md:p-8 lg:p-10">
      <div className="aspect-square overflow-hidden bg-[oklch(0.96_0.005_250)]">
        {activeImage ? (
          <img
            src={activeImage.url}
            alt={activeImage.altText ?? productTitle}
            className="h-full w-full object-contain mix-blend-multiply"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
            Image pending
          </div>
        )}
      </div>

      {gallery.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 md:gap-3">
          {gallery.map((image) => (
            <button
              key={image.url}
              type="button"
              onClick={() => onSelectImage(image)}
              className={`aspect-square overflow-hidden border bg-background transition-colors hover:border-accent ${
                activeImage?.url === image.url ? "border-accent" : "border-rule"
              }`}
              aria-label={`View ${image.altText ?? productTitle}`}
            >
              <img
                src={image.url}
                alt={image.altText ?? productTitle}
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function StockBadge({ variant, product }: { variant?: ShopifyVariant; product: ShopifyProduct }) {
  const quantity = variant?.quantityAvailable;
  const hasExactStock = typeof quantity === "number" && quantity > 0;
  const isAvailable = variant?.availableForSale || product.availableForSale;

  if (!isAvailable) {
    return (
      <span className="inline-flex items-center gap-2 border border-red-200 bg-red-50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-red-700">
        <PackageCheck className="h-3.5 w-3.5" />
        Out of stock
      </span>
    );
  }

  const leadTime =
    hasExactStock && quantity <= 5
      ? `${quantity + 1}+ normally 22 weeks`
      : "Additional quantities normally 22 weeks";

  return (
    <div className="inline-flex max-w-full flex-col gap-1 border border-accent/45 bg-charcoal-deep px-4 py-3 text-white shadow-sm ring-1 ring-white/10">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-display text-2xl font-extrabold leading-none tracking-tight text-accent">
          {hasExactStock ? quantity : "Available"}
        </span>
        <span className="font-display text-xl font-extrabold leading-none">
          {hasExactStock ? "in stock" : "to order"}
        </span>
        <span className="text-sm font-bold leading-none text-white/75">({leadTime})</span>
      </div>
      <div className="flex items-center gap-1.5 border-l-2 border-accent pl-3 text-sm font-semibold leading-tight text-white/90">
        Order by 3pm for next working day delivery*
        <HelpCircle className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
      </div>
    </div>
  );
}

function SpecBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-rule bg-surface p-4 shadow-[inset_3px_0_0_var(--color-accent)] md:p-5">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink">
        {label}
      </div>
      <div className="mt-3 break-words font-display text-[15px] font-bold leading-tight text-ink md:text-[17px]">
        {value}
      </div>
    </div>
  );
}

function ProductDescription({ product }: { product: ShopifyProduct }) {
  if (product.descriptionHtml) {
    return (
      <div
        className="mt-8 max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink-muted [&_a]:text-accent [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
      />
    );
  }

  return (
    <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
      {product.description || "Product details are being prepared. Contact us for specification help."}
    </p>
  );
}

function ProductResources({ product }: { product: ShopifyProduct }) {
  const resources = [
    ...product.technicalDetails.datasheets.map((resource) => ({ ...resource, type: "Datasheet" })),
    ...product.technicalDetails.manuals.map((resource) => ({ ...resource, type: "Manual" })),
  ];

  if (!product.technicalDetails.setupVideoUrl && resources.length === 0) return null;

  return (
    <section className="mt-10 border-t border-rule pt-8">
      <h2 className="font-display text-lg font-bold uppercase tracking-tight">Product support</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {product.technicalDetails.setupVideoUrl ? (
          <a
            href={product.technicalDetails.setupVideoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 border border-rule bg-background p-4 text-sm transition-colors hover:border-accent hover:text-accent"
          >
            <PlayCircle className="h-5 w-5 text-accent" />
            Setup video
          </a>
        ) : null}
        {resources.map((resource) => (
          <a
            key={`${resource.type}-${resource.url}`}
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 border border-rule bg-background p-4 text-sm transition-colors hover:border-accent hover:text-accent"
          >
            <FileText className="h-5 w-5 text-accent" />
            {resource.type}: {resource.label}
          </a>
        ))}
      </div>
    </section>
  );
}

function QuestionActions({
  product,
  variant,
}: {
  product: ShopifyProduct;
  variant?: ShopifyVariant;
}) {
  return (
    <section className="mt-10 border-t border-rule pt-8">
      <h2 className="font-display text-lg font-bold uppercase tracking-tight">Got a question?</h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href={productQuestionMailto(product, variant)}
          className="inline-flex h-12 items-center justify-center gap-2 border border-rule px-5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
        >
          <Mail className="h-4 w-4" />
          Email question
        </a>
        <a
          href={productQuestionWhatsApp(product, variant)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 border border-rule px-5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp question
        </a>
      </div>
    </section>
  );
}
