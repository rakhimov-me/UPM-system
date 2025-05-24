CREATE TABLE IF NOT EXISTS public.flight_request (
  id            SERIAL PRIMARY KEY,
  drone_id      INTEGER NOT NULL
                  REFERENCES public.drone(id)
                  ON DELETE CASCADE,
  route         JSONB    NOT NULL,
  scheduled_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  status        TEXT     NOT NULL DEFAULT 'pending'
);
