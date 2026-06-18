import { createFileRoute } from "@tanstack/react-router";

import { CollectionPage } from "@/components/shopify/CollectionPage";
import { getCollection, getLatestProducts } from "@/lib/api/shopify.functions";
import packing from "@/assets/cat-packing.jpg";

const collectionHandle = "packing";

export const Route = createFileRoute("/packing")({
  head: () => ({
    meta: [
      { title: "Packing Machinery Spares | Spares Automation" },
      {
        name: "description",
        content: "Live Shopify collection for packing machinery spares.",
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
  component: PackingPage,
});

function PackingPage() {
  const { collection, products } = Route.useLoaderData();

  return (
    <CollectionPage
      eyebrow="Catalogue / Logistics / Vertical 03"
      title="PACKING / MACHINERY"
      image={packing}
      imageAlt="Packing machinery"
      intro="Specialist spares for industrial packing and bagging lines, powered by live Shopify products and inventory."
      collection={collection}
      fallbackProducts={products}
      expectedHandle={collectionHandle}
    />
  );
}
