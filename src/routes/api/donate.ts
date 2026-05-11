import { createFileRoute } from "@tanstack/react-router";
import { createHmac } from "crypto";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const donationSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  mobile: z.string().trim().regex(/^\d{10}$/, "Mobile must be 10 digits"),
  amount: z.number().positive().max(10_000_000),
  gotra_message: z.string().trim().max(500).optional().nullable(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const Route = createFileRoute("/api/donate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const parsed = donationSchema.safeParse(body);
          if (!parsed.success) {
            return Response.json(
              { error: "Invalid input", details: parsed.error.flatten() },
              { status: 400 },
            );
          }
          const data = parsed.data;

          // Verify Razorpay signature
          const keySecret =
            process.env.RAZORPAY_KEY_SECRET || "DUMMY_KEY_SECRET";
          const expected = createHmac("sha256", keySecret)
            .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
            .digest("hex");

          const verified = expected === data.razorpay_signature;

          const { error } = await supabaseAdmin.from("donations").insert({
            full_name: data.full_name,
            email: data.email,
            mobile: data.mobile,
            amount: data.amount,
            gotra_message: data.gotra_message ?? null,
            order_id: data.razorpay_order_id,
            payment_id: data.razorpay_payment_id,
            payment_status: verified ? "success" : "signature_mismatch",
          });

          if (error) {
            console.error("DB insert error:", error);
            return Response.json({ error: "DB error" }, { status: 500 });
          }

          if (!verified) {
            return Response.json(
              { error: "Payment signature mismatch" },
              { status: 400 },
            );
          }
          return Response.json({ ok: true });
        } catch (err) {
          console.error(err);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
      },
    },
  },
});