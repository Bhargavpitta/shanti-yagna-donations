import { createFileRoute } from "@tanstack/react-router";

// Creates a Razorpay order on the server.
// Replace RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET with your real test/live keys
// (set them via Lovable Cloud secrets).
export const Route = createFileRoute("/api/razorpay/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { amount } = (await request.json()) as { amount: number };
          if (!amount || amount < 1) {
            return Response.json({ error: "Invalid amount" }, { status: 400 });
          }

          const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_DUMMY_KEY_ID";
          const keySecret =
            process.env.RAZORPAY_KEY_SECRET || "DUMMY_KEY_SECRET";

          const auth = btoa(`${keyId}:${keySecret}`);
          const res = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify({
              amount: Math.round(amount * 100), // paise
              currency: "INR",
              receipt: `don_${Date.now()}`,
            }),
          });

          if (!res.ok) {
            const text = await res.text();
            console.error("Razorpay order error:", text);
            return Response.json(
              { error: "Failed to create order", detail: text },
              { status: 502 },
            );
          }

          const order = await res.json();
          return Response.json({ order, keyId });
        } catch (err) {
          console.error(err);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
      },
    },
  },
});