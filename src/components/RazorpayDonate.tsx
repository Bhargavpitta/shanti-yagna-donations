import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, HeartHandshake, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const presets = [501, 1001, 2101, 5001];

const schema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().email("Valid email required").max(255),
  mobile: z.string().trim().regex(/^\d{10}$/, "Enter a 10-digit mobile"),
  amount: z.number().positive("Amount must be greater than 0").max(10_000_000),
  gotra_message: z.string().trim().max(500).optional(),
});

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function RazorpayDonate() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState<number | "">(1001);
  const [custom, setCustom] = useState("");
  const [gotra, setGotra] = useState("");
  const [loading, setLoading] = useState(false);
  const [thanks, setThanks] = useState<{ name: string; amount: number } | null>(
    null,
  );

  useEffect(() => {
    loadRazorpay();
  }, []);

  const handlePreset = (v: number) => {
    setAmount(v);
    setCustom("");
  };
  const handleCustom = (v: string) => {
    setCustom(v);
    const n = parseInt(v, 10);
    setAmount(isNaN(n) ? "" : n);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({
      full_name: fullName,
      email,
      mobile,
      amount: typeof amount === "number" ? amount : 0,
      gotra_message: gotra || undefined,
    });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast.error(first.message);
      return;
    }
    const ok = await loadRazorpay();
    if (!ok) {
      toast.error("Could not load payment gateway. Try again.");
      return;
    }
    setLoading(true);
    try {
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parsed.data.amount }),
      });
      if (!orderRes.ok) throw new Error("Order creation failed");
      const { order, keyId } = await orderRes.json();

      const rzp = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Sri Krishna Jyothi Swarupanandha Trust",
        description: "Sri Krishna Kalachakram Brahma Yagna — Donation",
        prefill: {
          name: parsed.data.full_name,
          email: parsed.data.email,
          contact: parsed.data.mobile,
        },
        theme: { color: "#FF6B00" },
        handler: async (resp: any) => {
          try {
            const verifyRes = await fetch("/api/donate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...parsed.data,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              }),
            });
            if (!verifyRes.ok) throw new Error("Verification failed");
            setThanks({
              name: parsed.data.full_name,
              amount: parsed.data.amount,
            });
            setFullName("");
            setEmail("");
            setMobile("");
            setGotra("");
          } catch (err) {
            toast.error("Payment recorded but verification failed.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Could not start payment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-card border-2 border-[var(--gold)]/40 p-6 sm:p-10 shadow-divine space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile (10 digits) *</Label>
            <Input
              id="mobile"
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="9876543210"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gotra">Gotra / Message (optional)</Label>
            <Input
              id="gotra"
              value={gotra}
              onChange={(e) => setGotra(e.target.value)}
              placeholder="Bharadwaja Gotra / Sankalpa"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Donation Amount (₹) *</Label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePreset(p)}
                className={`px-4 py-2 rounded-full border-2 font-semibold transition-all ${
                  amount === p && custom === ""
                    ? "bg-saffron text-white border-[var(--saffron)] shadow-divine"
                    : "bg-cream text-deep-red border-[var(--gold)]/50 hover:border-[var(--saffron)]"
                }`}
              >
                ₹{p.toLocaleString("en-IN")}
              </button>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-deep-red font-semibold">₹</span>
              <Input
                type="number"
                min={1}
                value={custom}
                onChange={(e) => handleCustom(e.target.value)}
                placeholder="Custom amount"
                className="w-40"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full sm:w-auto bg-saffron hover:opacity-90 text-white font-display tracking-wide text-base px-10"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
            </>
          ) : (
            <>
              <HeartHandshake className="w-5 h-5 mr-2" /> Proceed to Pay
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          Secured by Razorpay. By donating you accept our terms. For test mode,
          use test card 4111 1111 1111 1111.
        </p>
      </form>

      <Dialog open={!!thanks} onOpenChange={(o) => !o && setThanks(null)}>
        <DialogContent className="bg-cream border-[var(--gold)]">
          <DialogHeader>
            <div className="mx-auto mb-2 w-14 h-14 rounded-full gradient-saffron flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-center text-2xl text-deep-red font-display">
              Hari Om, {thanks?.name}!
            </DialogTitle>
            <DialogDescription className="text-center text-base text-foreground">
              Your generous offering of{" "}
              <span className="font-bold text-saffron">
                ₹{thanks?.amount.toLocaleString("en-IN")}
              </span>{" "}
              has been received with gratitude. May Sri Krishna shower His
              choicest blessings upon you and your family.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}