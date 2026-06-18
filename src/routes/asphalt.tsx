import { createFileRoute } from "@tanstack/react-router";

import { CollectionPage } from "@/components/shopify/CollectionPage";
import { getCollection, getLatestProducts } from "@/lib/api/shopify.functions";
import asphalt from "@/assets/asphalt-plant.jpg";

const collectionHandle = "asphalt";

export const Route = createFileRoute("/asphalt")({
  head: () => ({
    meta: [
      { title: "Asphalt Spares | Spares Automation" },
      {
        name: "description",
        content: "Live Shopify collection for asphalt and blacktop plant spares.",
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
  component: AsphaltPage,
});

function AsphaltPage() {
  const { collection, products } = Route.useLoaderData();

  return (
    <CollectionPage
      eyebrow="Catalogue / Heavy Plant / Vertical 01"
      title="ASPHALT / BLACKTOP"
      image={asphalt}
      imageAlt="Asphalt plant"
      intro="Specialist procurement of bituminous mixing plant components. From burner systems to drum mixer seals, products added to Shopify appear here automatically."
      collection={collection}
      fallbackProducts={products}
      expectedHandle={collectionHandle}
    />
  );
}
