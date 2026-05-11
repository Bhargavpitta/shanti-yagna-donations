# Sri Krishna Kalachakram Brahma Yagna — Donation Site

Single-page donation site for the **90th Vishwa Shanti Maha Yoga Mahotsavam**
by Sri Sri Sri Krishnajyothi Swarupanandha Swamiji.

## Stack

- React 19 + TypeScript + TanStack Start (Vite)
- Tailwind v4 design system (saffron / gold / deep-red / cream + Cinzel & Lato fonts)
- Lovable Cloud (Supabase Postgres) for donor records
- Razorpay Checkout for payments (test mode by default)
- ExcelJS for admin .xlsx export

## Server endpoints

| Method | Path | Purpose |
| ------ | ---- | ------- |
| POST | `/api/razorpay/create-order` | Creates a Razorpay order (returns `order` + `keyId`) |
| POST | `/api/donate` | Verifies Razorpay signature & saves donor to DB |
| GET  | `/api/donors/export?admin_key=...` | Downloads donors as `.xlsx` (admin only) |

## Configuration (replace dummy values)

Add the following secrets in **Lovable Cloud → Project Settings → Secrets**
(or as env vars in your deployment):

| Name | Description |
| ---- | ----------- |
| `RAZORPAY_KEY_ID` | Your Razorpay key (e.g. `rzp_test_xxx` / `rzp_live_xxx`) |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `ADMIN_EXPORT_KEY` | Password for `/api/donors/export?admin_key=...` |

Until you set these, the server uses placeholder values and **payments will fail at Razorpay**.

## Donor table (auto-created)

`public.donations` columns:
`id, full_name, email, mobile, amount, gotra_message, payment_id, order_id, payment_status, created_at`

RLS is enabled. Inserts go through the server (service-role) after Razorpay
signature verification — clients cannot insert directly.

## Excel export

```
GET /api/donors/export?admin_key=YOUR_ADMIN_KEY
```

Columns: `S.No | Full Name | Email | Mobile | Amount (₹) | Gotra/Message | Payment ID | Payment Status | Date & Time`.

## Razorpay test card

- Card: `4111 1111 1111 1111`
- Any future expiry, any CVV, any name.