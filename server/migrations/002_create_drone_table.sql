CREATE TABLE IF NOT EXISTS public.drone (
  id            SERIAL PRIMARY KEY,
  brand         TEXT    NOT NULL,
  model         TEXT    NOT NULL,
  serial_number TEXT    UNIQUE NOT NULL,
  pilot_id      INTEGER NOT NULL
    REFERENCES public.pilot(id)
    ON DELETE CASCADE
);
