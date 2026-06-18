import { createFileRoute, Link } from "@tanstack/react-router";

import { ProductDetail } from "@/components/shopify/ProductDetail";
import { SiteHeader } from "@/components/shopify/SiteHeader";
import { getProduct } from "@/lib/api/shopify.functions";

export const Route = createFileRoute("/products/$handle")({
  loader: async ({ params }) => ({
    product: await getProduct({ data: { handle: params.handle } }),
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-ink">
        <SiteHeader />
        <div className="mx-auto max-w-[900px] px-6 py-24 text-center">
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight">
            Product not found
          </h1>
          <p className="mt-4 text-ink-muted">
            This product may be inactive, unpublished from Headless, or removed from Shopify.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex h-11 items-center justify-center bg-accent px-6 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-foreground"
          >
            Return to catalogue
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
