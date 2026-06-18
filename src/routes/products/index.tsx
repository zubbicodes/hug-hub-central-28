import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Filter, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/shopify/ProductCard";
import { SiteHeader } from "@/components/shopify/SiteHeader";
import { getLatestProducts } from "@/lib/api/shopify.functions";
import type { ShopifyProduct } from "@/lib/shopify/types";
import automation from "@/assets/cat-automation.jpg";

type CategoryFilter = {
  label: string;
  handle: string;
  description: string;
};

const categoryFilters: CategoryFilter[] = [
  {
    label: "Asphalt Spares",
    handle: "asphalt",
    description: "Burners, conveyors, drum mixer wear parts",
  },
  {
    label: "Concrete Spares",
    handle: "concrete",
    description: "Batching, weighing, mixers, silo parts",
  },
  {
    label: "Packing Machinery",
    handle: "packing",
    description: "Sealers, rollers, belts, packing line parts",
  },
  {
    label: "Automation & Drives",
    handle: "automation",
    description: "VFDs, PLC modules, relays, sensors",
  },
  {
    label: "Home Controls",
    handle: "home-controls",
    description: "Smart relays, sensors, DIN rail supplies",
  },
  {
    label: "New Arrivals",
    handle: "new-arrivals",
    description: "Recently added Shopify catalogue items",
  },
];

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "All Products | Spares Automation" },
      {
        name: "description",
        content:
          "Browse all Shopify products across asphalt, concrete, packing, automation and control categories.",
      },
    ],
  }),
  loader: async () => ({
    products: await getLatestProducts({ data: { first: 100, query: undefined } }),
  }),
  component: ProductsCataloguePage,
});

function productMatchesCategory(product: ShopifyProduct, handle: string) {
  const normalizedTags = product.tags.map((tag) => tag.toLowerCase());
  return normalizedTags.some(
    (tag) => tag === handle || tag === `collection:${handle}` || tag.includes(handle),
  );
}

function ProductsCataloguePage() {
  const { products } = Route.useLoaderData();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [availability, setAvailability] = useState<"all" | "available">("all");
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc" | "title">("newest");

  const filteredProducts = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();

    return products
      .filter((product) => {
        if (activeCategory !== "all" && !productMatchesCategory(product, activeCategory)) {
          return false;
        }

        if (availability === "available" && !product.availableForSale) {
          return false;
        }

        if (!needle) return true;

        return [
          product.title,
          product.vendor,
          product.productType,
          product.description,
          ...product.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      })
      .sort((a, b) => {
        if (sort === "title") return a.title.localeCompare(b.title);

        const priceA = Number(a.priceRange.minVariantPrice.amount);
        const priceB = Number(b.priceRange.minVariantPrice.amount);

        if (sort === "price-asc") return priceA - priceB;
        if (sort === "price-desc") return priceB - priceA;

        return 0;
      });
  }, [activeCategory, availability, products, searchTerm, sort]);

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />

      <section className="relative flex min-h-[420px] items-end overflow-hidden">
        <img
          src={automation}
          alt="Industrial automation catalogue"
          className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-charcoal-deep/70 to-charcoal-deep/10" />
        <div className="relative mx-auto w-full max-w-[1600px] px-6 py-20">
          <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
            <span className="h-px w-8 bg-accent" />
            Shopify Catalogue / Live Products / GBP
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-white">
            ALL PRODUCTS <span className="text-accent">CATALOGUE</span>
          </h1>
          <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-white/60">
            Browse every product published from Shopify to the Headless sales channel. Filter by
            vertical, availability, part text, manufacturer, SKU-related tags, or price order.
          </p>
        </div>
      </section>

      <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit border border-rule bg-surface">
          <div className="border-b border-rule p-5">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
              <Filter className="h-4 w-4 text-accent" />
              Categories
            </div>
          </div>

          <div className="p-3">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`flex w-full items-center justify-between border px-4 py-4 text-left transition-colors ${
                activeCategory === "all"
                  ? "border-accent bg-accent/10"
                  : "border-transparent hover:border-rule hover:bg-background"
              }`}
            >
              <span>
                <span className="block font-display text-sm font-bold uppercase tracking-tight">
                  All Products
                </span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  Complete Shopify catalogue
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-accent" />
            </button>

            {categoryFilters.map((category) => (
              <button
                key={category.handle}
                type="button"
                onClick={() => setActiveCategory(category.handle)}
                className={`mt-2 flex w-full items-center justify-between border px-4 py-4 text-left transition-colors ${
                  activeCategory === category.handle
                    ? "border-accent bg-accent/10"
                    : "border-transparent hover:border-rule hover:bg-background"
                }`}
              >
                <span>
                  <span className="block font-display text-sm font-bold uppercase tracking-tight">
                    {category.label}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    {category.description}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-accent" />
              </button>
            ))}
          </div>
        </aside>

        <section>
          <div className="border border-rule bg-surface p-4">
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_180px_180px]">
              <label className="flex h-12 items-center gap-3 border border-rule bg-background px-4 transition-colors focus-within:border-accent">
                <Search className="h-4 w-4 text-ink-muted" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  type="search"
                  placeholder="Search products, vendors, tags, part names..."
                  className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-ink placeholder:text-ink-muted focus:outline-none"
                />
              </label>

              <label className="flex h-12 items-center gap-3 border border-rule bg-background px-4">
                <SlidersHorizontal className="h-4 w-4 text-ink-muted" />
                <select
                  value={availability}
                  onChange={(event) =>
                    setAvailability(event.target.value as "all" | "available")
                  }
                  className="min-w-0 flex-1 bg-transparent font-mono text-[11px] uppercase tracking-[0.16em] text-ink focus:outline-none"
                >
                  <option value="all">All Stock</option>
                  <option value="available">Available</option>
                </select>
              </label>

              <label className="flex h-12 items-center gap-3 border border-rule bg-background px-4">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as typeof sort)}
                  className="min-w-0 flex-1 bg-transparent font-mono text-[11px] uppercase tracking-[0.16em] text-ink focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="title">A-Z</option>
                  <option value="price-asc">Price Low</option>
                  <option value="price-desc">Price High</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredProducts.length} of {products.length} products
              </span>
              <span>
                Active filter:{" "}
                {activeCategory === "all"
                  ? "All Products"
                  : categoryFilters.find((category) => category.handle === activeCategory)?.label}
              </span>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-6 border border-dashed border-rule bg-surface px-8 py-16 text-center">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
                No products match these filters
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
                Clear the search term or switch to All Products. Shopify products must be active
                and published to the Headless sales channel to appear here.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSearchTerm("");
                  setAvailability("all");
                  setSort("newest");
                }}
                className="mt-8 inline-flex h-11 items-center justify-center bg-accent px-6 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-foreground"
              >
                Reset Filters
              </button>
            </div>
          )}

          <div className="mt-10 border border-rule bg-charcoal-deep p-6 text-white/70">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
              Trade Support
            </div>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="max-w-2xl text-sm leading-relaxed text-white/50">
                Cannot identify the right part? Send a part number, manufacturer reference, or
                equipment photo to the procurement desk.
              </p>
              <Link
                to="/contact-us"
                className="inline-flex h-11 shrink-0 items-center justify-center border border-white/10 px-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:border-accent hover:text-accent"
              >
                Request Quote
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
