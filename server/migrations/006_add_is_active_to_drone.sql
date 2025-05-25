ALTER TABLE public.drone
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT NOW();