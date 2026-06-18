import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { CustomerAuthState } from "@/components/shopify/CustomerAuthState";
import { SiteHeader } from "@/components/shopify/SiteHeader";
import { startCustomerAuth } from "@/lib/api/customer-account.functions";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [missing, setMissing] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function startLogin() {
      try {
        const result = await startCustomerAuth({ data: { mode: "login" } });
        if (!mounted) return;
        if (result.ok) {
          window.location.href = result.url;
          return;
        }
        setMissing(result.missing);
      } catch {
        if (mounted) setError("Customer login could not be started.");
      }
    }

    startLogin();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />
      <CustomerAuthState
        title="Customer Sign In"
        label="Shopify Customer Account"
        missing={missing}
        error={error}
      />
    </div>
  );
}
