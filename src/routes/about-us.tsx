import { createFileRoute } from "@tanstack/react-router";
import { Globe, Phone } from "lucide-react";
import aboutImg from "@/assets/asphalt-plant.jpg";

import { SiteHeader } from "@/components/shopify/SiteHeader";

export const Route = createFileRoute("/about-us")({
  component: AboutUsPage,
});

function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />

      <section className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] min-h-[300px] w-full overflow-hidden flex items-end">
        <img src={aboutImg} alt="About Us" className="absolute inset-0 h-full w-full object-cover scale-105 blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-charcoal-deep/60 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1600px] px-4 md:px-6 lg:px-10 pb-12 md:pb-16 lg:pb-20">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 mb-4 md:mb-6">
            <span className="h-px w-6 md:w-8 bg-accent" />
            Company / Since 2008 / UK
          </div>
          <h1 className="font-display text-[2rem] md:text-[3rem] lg:text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-white uppercase">
            INDUSTRIAL<br /><span className="text-accent">PROCUREMENT</span> SPECIALISTS
          </h1>
          <p className="mt-4 md:mt-6 lg:mt-8 max-w-md lg:max-w-xl text-sm md:text-base leading-relaxed text-white/60">
            Founded in Manchester, Spares Automation has grown into the UK's leading 
            independent supplier of heavy plant components. We bridge the gap between 
            manufacturers and operators with technical expertise and rapid dispatch.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-24 bg-surface">
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 lg:gap-20">
             <div>
                <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-tight">Our Mission</h2>
                <p className="mt-4 md:mt-6 text-sm md:text-base text-ink-muted leading-relaxed">
                  To provide the most efficient procurement platform for heavy industry, 
                  minimising plant downtime through technical excellence and logistics precision.
                </p>
             </div>
             <div>
                <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-tight">Trade Support</h2>
                <p className="mt-4 md:mt-6 text-sm md:text-base text-ink-muted leading-relaxed">
                  We operate as a trade-only partner for asphalt, concrete, and automation engineers. 
                  Our Manchester desk provides real-time technical support for complex part identification.
                </p>
             </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-charcoal-deep text-white/70">
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 py-12 md:py-16 lg:py-20 text-center">
           <a href="/" className="text-accent font-mono text-[11px] uppercase tracking-widest hover:underline">Return to Overview</a>
        </div>
      </footer>
    </div>
  );
}
