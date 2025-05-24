CREATE TABLE IF NOT EXISTS public.pilot (
  id           SERIAL PRIMARY KEY,
  last_name    TEXT    NOT NULL,
  first_name   TEXT    NOT NULL,
  middle_name  TEXT,
  email        TEXT,
  phone        TEXT,
  created_at   TIMESTAMP DEFAULT NOW()
);