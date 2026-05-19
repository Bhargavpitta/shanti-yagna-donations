# Sri Krishna Kalachakram Brahma Yagna — Donation Site

Single-page donation site for the **90th Vishwa Shanti Maha Yoga Mahotsavam**
by Sri Sri Sri Krishnajyothi Swarupanandha Swamiji.

## Stack

- React 19 + TypeScript + TanStack Start (Vite)
- Tailwind v4 design system (saffron / gold / deep-red / cream + Cinzel & Lato fonts)
- Direct PostgreSQL connection for donor records
- Razorpay Checkout for payments (test mode by default)
- ExcelJS for admin .xlsx export

## Server endpoints

| Method | Path | Purpose |
| ------ | ---- | ------- |
| POST | `/api/razorpay/create-order` | Creates a Razorpay order (returns `order` + `keyId`) |
| POST | `/api/donate` | Verifies Razorpay signature & saves donor to DB |
| POST | `/api/admin/login` | Admin login and session cookie creation |
| POST | `/api/admin/logout` | Clears the admin session |
| GET  | `/api/admin/session` | Checks whether the admin is logged in |
| GET  | `/api/admin/donations` | Returns donor records for the dashboard |
| GET  | `/api/donors/export?admin_key=...` | Downloads donors as `.xlsx` (admin only) |

## Configuration

Add the following env vars locally/in your deployment:

| Name | Description |
| ---- | ----------- |
| `DATABASE_URL` | PostgreSQL connection string used by the server APIs |
| `RAZORPAY_KEY_ID` | Your Razorpay key (e.g. `rzp_test_xxx` / `rzp_live_xxx`) |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `ADMIN_USERNAME` | Username for `/admin` login |
| `ADMIN_PASSWORD` | Password for `/admin` login |
| `ADMIN_SESSION_SECRET` | Optional secret used to sign admin session cookies |
| `ADMIN_EXPORT_KEY` | Password for `/api/donors/export?admin_key=...` |

If `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` are missing, order creation fails at Razorpay.
If `DATABASE_URL` is missing, donation save/export APIs cannot reach the database.

## Admin dashboard

Visit `/admin` to access the protected dashboard.

Features:

- Login with `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- View donor name, email, mobile, amount, message, payment ID, and date
- See quick summary cards for donor count, successful payments, and total amount
- Download the Excel sheet directly from the dashboard

## How data is stored

This project stores donation data in a PostgreSQL table named `donations`.

Flow:

1. The browser submits the amount to `POST /api/razorpay/create-order`.
2. The server uses `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` to create an order at Razorpay.
3. Razorpay Checkout collects the payment from the donor.
4. After payment, the browser sends donor details plus `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` to `POST /api/donate`.
5. The server verifies the signature using `RAZORPAY_KEY_SECRET`.
6. If the insert succeeds, the server writes one row into `donations` using the direct PostgreSQL connection string.

`donations` columns:
`id, full_name, email, mobile, amount, gotra_message, payment_id, order_id, payment_status, created_at`

The table is created automatically by the server if it does not already exist. Reads and writes happen only through the server APIs after Razorpay signature verification.

## Excel export

```
GET /api/donors/export?admin_key=YOUR_ADMIN_KEY
```

Columns: `S.No | Full Name | Email | Mobile | Amount (₹) | Gotra/Message | Payment ID | Payment Status | Date & Time`.

## Razorpay test card

- Card: `4111 1111 1111 1111`
- Any future expiry, any CVV, any name.
