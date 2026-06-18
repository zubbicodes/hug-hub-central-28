import { createFileRoute } from "@tanstack/react-router";

import { CollectionPage } from "@/components/shopify/CollectionPage";
import { getCollection, getLatestProducts } from "@/lib/api/shopify.functions";
import homeImg from "@/assets/cat-home.jpg";

const collectionHandle = "home-controls";

export const Route = createFileRoute("/home-controls")({
  head: () => ({
    meta: [
      { title: "Home Controls | Spares Automation" },
      {
        name: "description",
        content: "Live Shopify collection for home controls and automation products.",
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
  component: HomeControlsPage,
});

function HomeControlsPage() {
  const { collection, products } = Route.useLoaderData();

  return (
    <CollectionPage
      eyebrow="Catalogue / Systems / Vertical 04"
      title="HOME / CONTROLS"
      image={homeImg}
      imageAlt="Home controls"
      intro="Advanced automation for residential and light commercial environments, synced from Shopify."
      collection={collection}
      fallbackProducts={products}
      expectedHandle={collectionHandle}
    />
  );
}
