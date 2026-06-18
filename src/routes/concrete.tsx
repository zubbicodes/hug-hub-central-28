import { createFileRoute } from "@tanstack/react-router";

import { CollectionPage } from "@/components/shopify/CollectionPage";
import { getCollection, getLatestProducts } from "@/lib/api/shopify.functions";
import concrete from "@/assets/concrete-plant.jpg";

const collectionHandle = "concrete";

export const Route = createFileRoute("/concrete")({
  head: () => ({
    meta: [
      { title: "Concrete Spares | Spares Automation" },
      {
        name: "description",
        content: "Live Shopify collection for ready-mix concrete plant spares.",
      },
    ],
  }),
  loader: async () => {
    const collection = await getCollection({ data: { handle: collectionHandle, first: 48 } });
    const products = collection
      ? []
      : await getLatestProducts({
          data: { first: 48, query: `tag:'collection:${collectionHandle}'` },
        });
    return { collection, products };
  },
  component: ConcretePage,
});

function ConcretePage() {
  const { collection, products } = Route.useLoaderData();

  return (
    <CollectionPage
      eyebrow="Catalogue / Heavy Plant / Vertical 02"
      title="READY-MIX / CONCRETE"
      accent="amber"
      image={concrete}
      imageAlt="Ready-mix concrete plant"
      intro="Comprehensive parts support for ready-mix concrete plants. Publish Shopify products to this collection and they will appear here automatically."
      collection={collection}
      fallbackProducts={products}
      expectedHandle={collectionHandle}
    />
  );
}
