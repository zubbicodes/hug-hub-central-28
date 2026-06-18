import { createFileRoute } from "@tanstack/react-router";

import { CollectionPage } from "@/components/shopify/CollectionPage";
import { getLatestProducts } from "@/lib/api/shopify.functions";
import automation from "@/assets/cat-automation.jpg";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ deps }) => ({
    products: await getLatestProducts({
      data: {
        first: 48,
        query: deps.q ? deps.q : undefined,
      },
    }),
    q: deps.q,
  }),
  component: SearchPage,
});

function SearchPage() {
  const { products, q } = Route.useLoaderData();

  return (
    <CollectionPage
      eyebrow="Search / Shopify Catalogue"
      title={q ? `RESULTS / ${q}` : "SHOPIFY / SEARCH"}
      image={automation}
      imageAlt="Industrial automation search"
      intro="Search results are pulled directly from Shopify products published to the Headless sales channel."
      collection={null}
      fallbackProducts={products}
      expectedHandle="search"
    />
  );
}
