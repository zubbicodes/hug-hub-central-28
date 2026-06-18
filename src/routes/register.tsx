import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";

import { SiteHeader } from "@/components/shopify/SiteHeader";
import { createShopifyCustomer } from "@/lib/api/shopify.functions";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

type RegistrationResult = {
  status: "idle" | "success" | "error";
  message: string;
};

function normalizePhoneForShopify(countryCode: string, phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (!cleaned) return "";

  const international = cleaned.startsWith("+")
    ? cleaned
    : `${countryCode}${cleaned.replace(/^0+/, "")}`;

  return /^\+[1-9]\d{6,14}$/.test(international) ? international : null;
}

function RegisterPage() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<RegistrationResult>({ status: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setResult({ status: "idle", message: "" });

    const form = new FormData(formElement);
    const phone = normalizePhoneForShopify(
      String(form.get("countryCode") ?? "+44"),
      String(form.get("phone") ?? ""),
    );

    if (phone === null) {
      setBusy(false);
      setResult({
        status: "error",
        message: "Enter a valid phone number with the correct country code.",
      });
      return;
    }

    try {
      const response = await createShopifyCustomer({
        data: {
          firstName: String(form.get("firstName") ?? ""),
          lastName: String(form.get("lastName") ?? ""),
          email: String(form.get("email") ?? ""),
          phone,
          password: String(form.get("password") ?? ""),
          acceptsMarketing: form.get("acceptsMarketing") === "on",
        },
      });

      if (response.errors.length) {
        setResult({
          status: "error",
          message: response.errors.map((error) => error.message).join(" "),
        });
        return;
      }

      setResult({
        status: "success",
        message:
          "Your account has been created in Shopify. Check your email if Shopify asks you to verify the account before signing in.",
      });
      formElement.reset();
    } catch (error) {
      setResult({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Shopify could not create this customer account.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />

      <main className="mx-auto grid max-w-[1180px] gap-8 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex min-h-[520px] flex-col justify-between border border-rule bg-charcoal p-8 text-white md:p-10">
          <div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" /> Back to catalogue
            </Link>
            <div className="mt-16 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              Trade Customer Access
            </div>
            <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-none tracking-tight">
              Create Your Account
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
              Register directly with Spares Automation. The account is created in Shopify, so
              customer data, checkout and future order history stay connected to the store.
            </p>
          </div>

          <div className="grid gap-4 border-t border-white/10 pt-6 text-sm text-white/55">
            <div>Trade pricing and order access after approval</div>
            <div>Account details synced into Shopify Customers</div>
          </div>
        </section>

        <section className="border border-rule bg-surface p-6 md:p-8">
          <div className="mb-8 flex h-12 w-12 items-center justify-center bg-accent text-accent-foreground">
            <UserPlus className="h-5 w-5" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
            Shopify Registration
          </div>
          <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight">
            New Customer
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="First name" name="firstName" autoComplete="given-name" required />
              <Field label="Last name" name="lastName" autoComplete="family-name" required />
            </div>
            <Field label="Email address" name="email" type="email" autoComplete="email" required />
            <PhoneField />
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />

            <label className="flex items-start gap-3 text-sm text-ink-muted">
              <input
                name="acceptsMarketing"
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[hsl(var(--accent))]"
              />
              Send me updates about parts availability, trade offers and new arrivals.
            </label>

            {result.message ? (
              <div
                className={`border p-4 text-sm leading-6 ${
                  result.status === "success"
                    ? "border-accent/40 bg-accent/10 text-ink"
                    : "border-red-500/30 bg-red-500/10 text-red-700"
                }`}
              >
                {result.status === "success" ? (
                  <CheckCircle2 className="mr-2 inline h-4 w-4 text-accent" />
                ) : null}
                {result.message}
              </div>
            ) : null}

            <button
              disabled={busy}
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 bg-accent px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              Create Account
            </button>

            <p className="text-sm text-ink-muted">
              Already registered?{" "}
              <Link to="/login" className="font-semibold text-ink transition-colors hover:text-accent">
                Sign in securely
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}

function PhoneField() {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
        Phone number
      </span>
      <div className="grid grid-cols-[132px_1fr] border border-rule bg-background focus-within:border-accent">
        <select
          name="countryCode"
          defaultValue="+44"
          className="h-12 border-r border-rule bg-background px-3 text-sm text-ink outline-none"
          aria-label="Phone country code"
        >
          <option value="+44">UK +44</option>
          <option value="+353">IE +353</option>
          <option value="+92">PK +92</option>
          <option value="+1">US +1</option>
          <option value="+971">AE +971</option>
        </select>
        <input
          name="phone"
          type="tel"
          autoComplete="tel-national"
          inputMode="tel"
          placeholder="03027458952"
          className="h-12 bg-transparent px-4 text-sm text-ink outline-none placeholder:text-ink-muted"
        />
      </div>
      <span className="text-xs leading-5 text-ink-muted">
        Shopify receives this in international format, for example +923027458952.
      </span>
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  minLength,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
        {label}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        minLength={minLength}
        required={required}
        className="h-12 border border-rule bg-background px-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-accent"
      />
    </label>
  );
}
