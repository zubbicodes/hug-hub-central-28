import { createFileRoute } from "@tanstack/react-router";

import { CollectionPage } from "@/components/shopify/CollectionPage";
import { getCollection, getLatestProducts } from "@/lib/api/shopify.functions";
import automation from "@/assets/cat-automation.jpg";

const collectionHandle = "automation";

export const Route = createFileRoute("/automation")({
  head: () => ({
    meta: [
      { title: "Automation & Drives | Spares Automation" },
      {
        name: "description",
        content: "Live Shopify collection for automation, drives, and controls.",
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
  component: AutomationPage,
});

function AutomationPage() {
  const { collection, products } = Route.useLoaderData();

  return (
    <CollectionPage
      eyebrow="Catalogue / Systems / Vertical 03"
      title="AUTOMATION / DRIVES"
      image={automation}
      imageAlt="Automation and drives"
      intro="VFDs, PLC modules, servo drives, relays, and control spares synced from Shopify."
      collection={collection}
      fallbackProducts={products}
      expectedHandle={collectionHandle}
    />
  );
}
