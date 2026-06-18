import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import contactImg from "@/assets/cat-automation.jpg";

import { SiteHeader } from "@/components/shopify/SiteHeader";

export const Route = createFileRoute("/contact-us")({
  component: ContactUsPage,
});

function ContactUsPage() {
  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />

      <section className="relative h-[35vh] md:h-[45vh] lg:h-[50vh] min-h-[250px] w-full overflow-hidden flex items-end">
        <img src={contactImg} alt="Contact Us" className="absolute inset-0 h-full w-full object-cover scale-105 blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-charcoal-deep/60 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1600px] px-4 md:px-6 lg:px-10 pb-12 md:pb-16 lg:pb-20">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 mb-4 md:mb-6">
            <span className="h-px w-6 md:w-8 bg-accent" />
            Support / Manchester / UK HQ
          </div>
          <h1 className="font-display text-[2rem] md:text-[3rem] lg:text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-white uppercase">
            GET IN<br /><span className="text-accent">TOUCH</span> WITH US
          </h1>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-24 bg-surface">
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-10">
           <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3 lg:gap-12">
              <div className="border border-rule p-6 md:p-8 lg:p-10 bg-background">
                 <Phone className="h-5 w-5 md:h-6 md:w-6 text-accent mb-4 md:mb-6" />
                 <h3 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight">Technical Sales</h3>
                 <p className="mt-3 md:mt-4 text-ink-muted text-sm md:text-base">+44 (0)161 818 7420</p>
                 <p className="mt-2 text-ink-muted text-sm md:text-base italic">Mon–Fri 07:30–18:00 GMT</p>
              </div>
              <div className="border border-rule p-6 md:p-8 lg:p-10 bg-background">
                 <Mail className="h-5 w-5 md:h-6 md:w-6 text-accent mb-4 md:mb-6" />
                 <h3 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight">Email Enquiries</h3>
                 <p className="mt-3 md:mt-4 text-ink-muted text-sm md:text-base">trade@spares-automation.co.uk</p>
                 <p className="mt-2 text-ink-muted text-sm md:text-base italic">24h Response Guarantee</p>
              </div>
              <div className="border border-rule p-6 md:p-8 lg:p-10 bg-background">
                 <MapPin className="h-5 w-5 md:h-6 md:w-6 text-accent mb-4 md:mb-6" />
                 <h3 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight">Manchester HQ</h3>
                 <p className="mt-3 md:mt-4 text-ink-muted text-sm md:text-base">Trafford Park Trade Centre</p>
                 <p className="mt-2 text-ink-muted text-sm md:text-base">Manchester, M17 1RU, UK</p>
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
