import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Mail } from "lucide-react";
import { useState } from "react";

import asphalt from "@/assets/asphalt-plant.jpg";
import concrete from "@/assets/concrete-plant.jpg";
import catAutomation from "@/assets/cat-automation.jpg";
import catHome from "@/assets/cat-home.jpg";
import catPacking from "@/assets/cat-packing.jpg";
import { SiteFooter } from "@/components/shopify/SiteFooter";
import { SiteHeader } from "@/components/shopify/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spares Automation - Industrial Parts & Automation Spares" },
      {
        name: "description",
        content:
          "Browse industrial spares, automation parts, and cart-ready product ranges.",
      },
      { property: "og:title", content: "Spares Automation" },
      { property: "og:description", content: "Industrial parts and automation support." },
    ],
  }),
  component: Home,
});

const primaryRanges = [
  {
    id: "asphalt",
    title: "Asphalt / Blacktop Spares",
    copy: "Feeders, burner and drying parts, bitumen equipment, hot stone, silos, baghouse and mixing tower spares.",
    img: asphalt,
    to: "/asphalt",
    accent: "accent",
    eyebrow: "Heavy plant / bituminous",
    hoverTitle: "Asphalt spares",
    hoverCopy: "Choose from feeders, burner and drying, bitumen, hot stone, baghouse and mixing tower parts.",
    lines: [
      { code: "AS-01", label: "Feeders", copy: "Belts, idlers, drives", href: "/asphalt?line=feeders" },
      { code: "AS-02", label: "Burner / Drying", copy: "Nozzles, pumps, flame parts", href: "/asphalt?line=burner-drying" },
      { code: "AS-03", label: "Bitumen", copy: "Pumps, valves, hoses", href: "/asphalt?line=bitumen" },
      { code: "AS-04", label: "Hot Stone / Silos", copy: "Bins, gates, storage parts", href: "/asphalt?line=hot-stone-silos" },
      { code: "AS-05", label: "Baghouse", copy: "Filters, bags, cages", href: "/asphalt?line=baghouse" },
      { code: "AS-06", label: "Mixing Tower", copy: "Paddles, liners, seals", href: "/asphalt?line=mixing-tower" },
    ],
  },
  {
    id: "concrete",
    title: "Ready-Mix / Concrete Spares",
    copy: "Batching, weighing, mixers, silos, pneumatic valves and plant control components.",
    img: concrete,
    to: "/concrete",
    accent: "amber",
    eyebrow: "Heavy plant / ready-mix",
    hoverTitle: "Concrete spares",
    hoverCopy: "Choose from batching, mixers, silos, weighing and valve components.",
    lines: [
      { code: "CN-01", label: "Batching", copy: "Hoppers and aggregate parts", href: "/concrete?line=batching" },
      { code: "CN-02", label: "Mixers", copy: "Paddles, shafts, liners", href: "/concrete?line=mixers" },
      { code: "CN-03", label: "Silos", copy: "Filters and aeration parts", href: "/concrete?line=silos" },
      { code: "CN-04", label: "Weighing", copy: "Load cells and scales", href: "/concrete?line=weighing" },
      { code: "CN-05", label: "Valves", copy: "Butterfly and pneumatic valves", href: "/concrete?line=valves" },
    ],
  },
];

const categories = [
  { n: "01", title: "Packing Machinery", copy: "Sealers, rollers, belts and conveyor parts", img: catPacking, to: "/packing" },
  { n: "02", title: "Automation & Drives", copy: "VFDs, PLC modules, relays and sensors", img: catAutomation, to: "/automation" },
  { n: "03", title: "Home Controls", copy: "Smart relays, sensors and DIN rail supplies", img: catHome, to: "/home-controls" },
  { n: "04", title: "New Arrivals", copy: "Recently added catalogue items", img: catAutomation, to: "/new-arrivals" },
];

function Home() {
  const [activeHero, setActiveHero] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />

      <section className="grid w-full grid-cols-1 md:grid-cols-2">
        {primaryRanges.map((range) => (
          <article
            key={range.title}
            onMouseEnter={() => setActiveHero(range.id)}
            onMouseLeave={() => setActiveHero(null)}
            className="group relative flex min-h-[430px] items-end overflow-hidden border-b border-rule md:min-h-[620px]"
          >
            <img
              src={range.img}
              alt={range.title}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-out group-hover:scale-[1.08] group-hover:blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-charcoal-deep/65 to-charcoal-deep/15 transition-colors duration-700 group-hover:from-charcoal-deep group-hover:via-charcoal-deep/80" />

            <Link
              to={range.to}
              className="relative z-10 block p-6 transition-all duration-500 md:p-10"
            >
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
                <span className={`h-px w-8 ${range.accent === "amber" ? "bg-amber" : "bg-accent"}`} />
                {range.eyebrow}
              </div>
              <h1 className="grid max-w-2xl font-display text-[2.2rem] font-extrabold uppercase leading-[0.95] tracking-tight text-white md:text-[4.5rem]">
                <span className="col-start-1 row-start-1 transition-all duration-500 group-hover:-translate-y-2 group-hover:opacity-0">
                  {range.title}
                </span>
                <span className="col-start-1 row-start-1 translate-y-2 text-[2rem] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:text-[4rem]">
                  {range.hoverTitle}
                </span>
              </h1>
              <p className="grid mt-5 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
                <span className="col-start-1 row-start-1 transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-0">
                  {range.copy}
                </span>
                <span className="col-start-1 row-start-1 translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {range.hoverCopy}
                </span>
              </p>
              <span className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white transition-colors group-hover:text-accent">
                Browse range
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>

            <div
              className={`pointer-events-none absolute inset-x-4 bottom-[245px] top-5 z-20 flex flex-col transition-all duration-500 md:inset-x-6 md:bottom-[300px] md:top-8 lg:bottom-[320px] ${
                activeHero === range.id
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <div className="pointer-events-auto flex items-center justify-between border-b border-white/15 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
                  Product lines / {range.lines.length.toString().padStart(2, "0")}
                </span>
                <Link
                  to={range.to}
                  className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
                    range.accent === "amber" ? "text-amber" : "text-accent"
                  }`}
                >
                  View all
                </Link>
              </div>
              <div className="pointer-events-auto mt-3 grid flex-1 grid-cols-1 content-start gap-1.5 overflow-hidden sm:grid-cols-2">
                {range.lines.map((line, index) => (
                  <a
                    key={line.code}
                    href={line.href}
                    style={{ transitionDelay: activeHero === range.id ? `${index * 45}ms` : "0ms" }}
                    className={`relative flex min-h-[52px] items-center overflow-hidden border bg-charcoal-deep/75 px-3 py-2 text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 md:min-h-[56px] ${
                      range.accent === "amber"
                        ? "border-white/10 hover:border-amber"
                        : "border-white/10 hover:border-accent"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-0 h-full w-[3px] ${
                        range.accent === "amber" ? "bg-amber" : "bg-accent"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/45">
                        {line.code}
                      </span>
                      <div className="mt-1 truncate font-display text-[13px] font-bold leading-tight md:text-[14px]">
                        {line.label}
                      </div>
                    </div>
                    <ChevronRight
                      className={`ml-3 h-3.5 w-3.5 shrink-0 ${
                        range.accent === "amber" ? "text-amber" : "text-accent"
                      }`}
                    />
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.title}
            to={category.to}
            className="group flex min-h-[360px] flex-col border-b border-rule bg-surface lg:border-l"
          >
            <div className="relative flex-1 overflow-hidden bg-[oklch(0.96_0.005_250)]">
              <img
                src={category.img}
                alt={category.title}
                loading="lazy"
                className="h-full w-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
                Range / {category.n}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-rule px-5 py-5 transition-colors group-hover:bg-charcoal-deep group-hover:text-white">
              <div>
                <h2 className="font-display text-[15px] font-bold uppercase tracking-tight">
                  {category.title}
                </h2>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted group-hover:text-white/50">
                  {category.copy}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted transition-all group-hover:translate-x-1 group-hover:text-accent" />
            </div>
          </Link>
        ))}
      </section>

      <section className="border-b border-rule bg-surface">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6 lg:px-10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
              Need help finding a part?
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight">
              Send a part number, product photo, or cart details.
            </h2>
          </div>
          <Link
            to="/contact-us"
            className="inline-flex h-12 items-center justify-center gap-2 bg-accent px-6 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-foreground transition-colors hover:bg-accent/90"
          >
            <Mail className="h-4 w-4" />
            Got a question?
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
