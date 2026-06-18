import { Link } from "@tanstack/react-router";
import { Globe, Phone, Search, ShoppingCart, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { getShopifyCart } from "@/lib/api/shopify.functions";
import { getStoredCartId } from "@/lib/shopify/cart";

export function SiteHeader() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function refreshCartCount() {
      const cartId = getStoredCartId();
      if (!cartId) {
        setCartCount(0);
        return;
      }
      try {
        const cart = await getShopifyCart({ data: { cartId } });
        if (mounted) setCartCount(cart?.totalQuantity ?? 0);
      } catch {
        if (mounted) setCartCount(0);
      }
    }

    refreshCartCount();
    window.addEventListener("shopify-cart-updated", refreshCartCount);
    return () => {
      mounted = false;
      window.removeEventListener("shopify-cart-updated", refreshCartCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-charcoal-deep text-white/80">
        <div className="flex h-9 w-full items-center justify-between px-6 font-mono text-[11px] uppercase tracking-[0.18em]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Globe className="h-3 w-3 text-accent" /> UK · EN-GB · GBP
            </span>
            <span className="hidden items-center gap-2 text-white/50 md:flex">
              <Phone className="h-3 w-3" /> +44 (0)161 818 7420 · Mon-Fri 07:30-18:00 GMT
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-accent"
            >
              <User className="h-3 w-3" /> Sign In
            </Link>
            <span className="h-3 w-px bg-white/15" />
            <Link
              to="/register"
              className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-accent"
            >
              <UserPlus className="h-3 w-3" /> Register
            </Link>
            <span className="h-3 w-px bg-white/15" />
            <Link
              to="/cart"
              className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-accent"
            >
              <ShoppingCart className="h-3 w-3" /> Cart
              {cartCount > 0 ? (
                <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[9px] font-bold text-accent-foreground">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-rule bg-charcoal">
        <div className="grid h-20 w-full grid-cols-12 items-center gap-6 px-6">
          <Link to="/" className="col-span-3 flex items-center gap-3">
            <div className="relative h-9 w-9">
              <div className="absolute inset-0 rotate-45 border-2 border-accent" />
              <div className="absolute inset-[6px] rotate-45 bg-accent" />
            </div>
            <div className="leading-none">
              <div className="font-display text-[17px] font-bold uppercase tracking-tight text-white">
                SPARES<span className="text-accent">.</span>AUTOMATION
              </div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-white/45">
                Industrial Procurement Platform
              </div>
            </div>
          </Link>

          <div className="col-span-9">
            <form
              action="/search"
              className="group flex h-12 items-center gap-3 border border-white/10 bg-white/[0.04] pl-4 pr-1 transition-colors focus-within:border-accent"
            >
              <Search className="h-4 w-4 text-white/50" />
              <input
                name="q"
                type="search"
                placeholder="Enter Part or Manufacturer Number to Search..."
                className="flex-1 bg-transparent font-mono text-[13px] tracking-wide text-white placeholder:text-white/40 focus:outline-none"
              />
              <span className="hidden h-9 items-center border-l border-white/10 px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 md:flex">
                ⌘ K
              </span>
              <button className="flex h-10 items-center gap-2 bg-accent px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-foreground transition-colors hover:bg-accent/90">
                Search Catalog
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
