
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  gotra_message TEXT,
  payment_id TEXT,
  order_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a donation (public donation form)
CREATE POLICY "Anyone can insert donations"
ON public.donations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No client-side select; admin export uses service role
CREATE POLICY "No public read"
ON public.donations FOR SELECT
TO anon, authenticated
USING (false);
