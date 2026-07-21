"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Banknote, Smartphone, Wallet } from "lucide-react";
import { useCart } from "@/lib/store";
import { api, apiEnabled } from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/types";

const STEPS = ["Address", "Shipping", "Payment", "Review"] as const;
type Step = (typeof STEPS)[number];

const DEFAULT_DELIVERY_FEE = 50;

const PAYMENTS: { id: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
  { id: "KNET", label: "KNET", icon: Wallet },
  { id: "CARD", label: "Visa / Mastercard", icon: CreditCard },
  { id: "APPLE_PAY", label: "Apple Pay", icon: Smartphone },
  { id: "COD", label: "Cash on Delivery", icon: Banknote },
];

const emptyAddress = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  area: "",
  block: "",
  street: "",
  building: "",
  apartment: "",
};

export function CheckoutClient() {
  const { items, subtotal: subtotalFn, clear } = useCart();
  const subtotal = subtotalFn();
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod>("KNET");
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [address, setAddress] = useState(emptyAddress);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(DEFAULT_DELIVERY_FEE);
  const [freeThreshold, setFreeThreshold] = useState<number | null>(null);

  // Mirror the backend's delivery-fee rules (managed in admin Settings) so the
  // summary matches what the order is actually charged.
  useEffect(() => {
    if (!apiEnabled) return;
    api<Record<string, string>>("/api/settings")
      .then((s) => {
        if (s.deliveryFee) setDeliveryFee(Number(s.deliveryFee));
        setFreeThreshold(s.freeDeliveryThreshold ? Number(s.freeDeliveryThreshold) : null);
      })
      .catch(() => undefined);
  }, []);

  const stepIndex = step;
  const delivery =
    items.length === 0 || (freeThreshold != null && freeThreshold > 0 && subtotal >= freeThreshold)
      ? 0
      : deliveryFee;
  const total = subtotal + delivery;

  const setAddr = (key: keyof typeof emptyAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((a) => ({ ...a, [key]: e.target.value }));

  async function placeOrder() {
    setError(null);

    if (!apiEnabled) {
      clear();
      setPlaced(true);
      return;
    }

    if (!address.fullName.trim() || !address.phone.trim()) {
      setError("Please fill in your name and phone number in the Address step.");
      setStep(0);
      return;
    }

    setPlacing(true);
    try {
      const deliveryAddress = [
        address.city && `City: ${address.city}`,
        address.area && `Area: ${address.area}`,
        address.block && `Block: ${address.block}`,
        address.street && `Street: ${address.street}`,
        address.building && `Building: ${address.building}`,
        address.apartment && `Apartment: ${address.apartment}`,
      ]
        .filter(Boolean)
        .join(", ");

      const res = await api<{ orderNumber: string }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          customerName: address.fullName,
          customerPhone: address.phone,
          customerEmail: address.email || null,
          paymentMethod: payment,
          notes: deliveryAddress ? `Delivery address — ${deliveryAddress}` : null,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
        auth: true,
      });
      setOrderNumber(res.orderNumber);
      clear();
      setPlaced(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place the order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  if (placed) {
    return (
      <div className="container-site flex flex-col items-center justify-center py-28 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-paper">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Order placed</h1>
        {orderNumber && (
          <p className="mt-2 text-sm font-medium">
            Order number: <span className="font-semibold">{orderNumber}</span>
          </p>
        )}
        <p className="mt-2 max-w-sm text-sm text-muted">
          Thank you. A confirmation has been sent and you can track your order from your account.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/account/orders" className="btn-primary">Track Order</Link>
          <Link href="/products" className="btn-ghost">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-site py-28 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <Link href="/products" className="btn-primary mt-6">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container-site py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>

      {/* progress */}
      <div className="mt-8 flex items-center">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-colors",
                  i <= stepIndex ? "border-ink bg-ink text-paper" : "border-line text-muted"
                )}
              >
                {i < stepIndex ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("hidden text-sm sm:block", i <= stepIndex ? "text-ink" : "text-muted")}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("mx-3 h-px flex-1", i < stepIndex ? "bg-ink" : "bg-line")} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {STEPS[step] === "Address" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" full value={address.fullName} onChange={setAddr("fullName")} />
                  <Field label="Phone" value={address.phone} onChange={setAddr("phone")} />
                  <Field label="Email (optional)" value={address.email} onChange={setAddr("email")} />
                  <Field label="City" value={address.city} onChange={setAddr("city")} />
                  <Field label="Area" value={address.area} onChange={setAddr("area")} />
                  <Field label="Block" value={address.block} onChange={setAddr("block")} />
                  <Field label="Street" value={address.street} onChange={setAddr("street")} />
                  <Field label="Building" value={address.building} onChange={setAddr("building")} />
                  <Field label="Apartment" value={address.apartment} onChange={setAddr("apartment")} />
                </div>
              )}

              {STEPS[step] === "Shipping" && (
                <div className="space-y-3">
                  {["Standard delivery (1–3 days)", "Express delivery (next day)"].map((opt, i) => (
                    <label key={opt} className="flex cursor-pointer items-center justify-between rounded-xl border border-line p-4 has-[:checked]:border-ink">
                      <span className="flex items-center gap-3 text-sm">
                        <input type="radio" name="shipping" defaultChecked={i === 0} className="accent-ink" />
                        {opt}
                      </span>
                      <span className="text-sm font-medium">{formatPrice(i === 0 ? 2 : 4)}</span>
                    </label>
                  ))}
                </div>
              )}

              {STEPS[step] === "Payment" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {PAYMENTS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setPayment(id)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition-colors",
                        payment === id ? "border-ink shadow-soft" : "border-line hover:border-ink"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {STEPS[step] === "Review" && (
                <div className="space-y-3">
                  {items.map((i) => (
                    <div key={i.productId} className="flex items-center justify-between border-b border-line py-3 text-sm">
                      <span>{i.name} × {i.quantity}</span>
                      <span className="font-medium">{formatPrice(i.price * i.quantity)}</span>
                    </div>
                  ))}
                  <p className="pt-2 text-sm text-muted">Payment method: <span className="text-ink">{payment}</span></p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <p className="mt-6 rounded-xl border border-line bg-mist px-4 py-3 text-sm">{error}</p>
          )}

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-ghost disabled:opacity-30"
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep((s) => s + 1)} className="btn-primary">Continue</button>
            ) : (
              <button
                onClick={placeOrder}
                disabled={placing}
                className="btn-primary disabled:opacity-60"
              >
                {placing ? "Placing order…" : "Place Order"}
              </button>
            )}
          </div>
        </div>

        {/* summary */}
        <aside className="h-fit rounded-card border border-line p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Order Summary</h2>
          <div className="mt-4 space-y-2.5 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Delivery" value={delivery === 0 ? "Free" : formatPrice(delivery)} />
            <div className="my-3 h-px bg-line" />
            <Row label="Total" value={formatPrice(total)} bold />
          </div>
          <div className="mt-5 flex gap-2">
            <input placeholder="Coupon code" className="h-11 flex-1 rounded-full border border-line px-4 text-sm outline-none focus:border-ink" />
            <button className="btn-ghost px-5">Apply</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  full,
  ...props
}: { label: string; full?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm", full && "sm:col-span-2")}>
      <span className="text-muted">{label}</span>
      <input
        {...props}
        className="h-11 rounded-xl border border-line px-3 outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold" : "text-muted"}>{label}</span>
      <span className={bold ? "text-base font-semibold" : ""}>{value}</span>
    </div>
  );
}
