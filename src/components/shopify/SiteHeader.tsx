import { Link } from "@tanstack/react-router";
import { Globe, Phone, Search, ShoppingCart, User, UserPlus, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { getShopifyCart, getShopifyCustomer } from "@/lib/api/shopify.functions";
import { getStoredCartId } from "@/lib/shopify/cart";

export function SiteHeader() {
  const [cartCount, setCartCount] = useState(0);
  const [customer, setCustomer] = useState<{
    id: string;
    displayName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    async function checkAuth() {
      try {
        const c = await getShopifyCustomer();
        if (mounted) setCustomer(c);
      } catch {
        if (mounted) setCustomer(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    refreshCartCount();
    checkAuth();
    window.addEventListener("shopify-cart-updated", refreshCartCount);
    return () => {
      mounted = false;
      window.removeEventListener("shopify-cart-updated", refreshCartCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-charcoal-deep text-white/80">
        <div className="flex h-9 w-full items-center justify-between px-4 font-mono text-[10px] uppercase tracking-[0.18em] md:px-6 md:text-[11px]">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="flex items-center gap-2">
              <Globe className="h-3 w-3 text-accent" /> UK / EN-GB / GBP
            </span>
            <span className="hidden items-center gap-2 text-white/50 md:flex">
              <Phone className="h-3 w-3" /> +44 (0)161 818 7420
            </span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            {customer ? (
              <Link
                to="/account"
                className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-accent"
              >
                <User className="h-3 w-3" />
                {customer.firstName || customer.displayName || "Account"}
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-accent"
              >
                <User className="h-3 w-3" /> Sign In
              </Link>
            )}
            <span className="h-3 w-px bg-white/15" />
            {!customer && (
              <>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-accent"
                >
                  <UserPlus className="h-3 w-3" /> Register
                </Link>
                <span className="h-3 w-px bg-white/15" />
              </>
            )}
            <Link
              to="/cart"
              className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-accent"
            >
              <ShoppingCart className="h-3 w-3" />
              {cartCount > 0 ? (
                <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[9px] font-bold text-accent-foreground">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
          <button
            className="flex items-center gap-2 text-white/70 transition-colors hover:text-accent md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <Link
              to="/cart"
              className="flex items-center gap-1 text-white/70 transition-colors hover:text-accent ml-2"
              onClick={(e) => e.stopPropagation()}
            >
              <ShoppingCart className="h-3 w-3" />
              {cartCount > 0 ? (
                <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[9px] font-bold text-accent-foreground">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[oklch(0.285_0.012_250)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {customer ? (
              <Link
                to="/account"
                className="flex items-center gap-2 text-white/70 transition-colors hover:text-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                {customer.firstName || customer.displayName || "Account"}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-white/70 transition-colors hover:text-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" /> Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 text-white/70 transition-colors hover:text-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserPlus className="h-4 w-4" /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <div className="border-b border-white/10 bg-[oklch(0.285_0.012_250)]">
        <div className="flex h-auto min-h-[5rem] w-full flex-col items-center gap-4 px-4 py-4 md:grid md:h-20 md:grid-cols-12 md:items-center md:gap-6 md:px-6 md:py-0">
          <Link to="/" className="flex items-center gap-3 md:col-span-3">
            <div className="relative h-9 w-9">
              <div className="absolute inset-0 rotate-45 border-2 border-accent" />
              <div className="absolute inset-[6px] rotate-45 bg-accent" />
            </div>
            <div className="leading-none">
              <div className="font-display text-[17px] font-bold uppercase tracking-tight text-white">
                SPARES<span className="text-accent">.</span>AUTOMATION
              </div>
              <div className="mt-1 hidden font-mono text-[9px] uppercase tracking-[0.28em] text-white/45 md:block">
                Product catalogue
              </div>
            </div>
          </Link>

          <div className="w-full md:col-span-9">
            <form
              action="/search"
              className="group flex h-12 items-center gap-3 border border-white/20 bg-white/[0.08] pl-4 pr-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors focus-within:border-accent focus-within:bg-white/[0.11]"
            >
              <Search className="h-4 w-4 text-accent/80" />
              <input
                name="q"
                type="search"
                placeholder="Search / Part / Product Number"
                className="flex-1 bg-transparent font-mono text-[13px] tracking-wide text-white placeholder:text-white/65 focus:outline-none"
              />
              <span className="hidden h-9 items-center border-l border-white/15 px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 md:flex">
                Part / product no.
              </span>
              <button className="flex h-10 items-center gap-2 bg-accent px-4 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-foreground transition-colors hover:bg-accent/90 md:px-6">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
