DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'flight_request'
      AND column_name  = 'startDate'
  )
  THEN
    ALTER TABLE public.flight_request RENAME COLUMN "startDate" TO start_date;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'flight_request'
      AND column_name  = 'endDate'
  )
  THEN
    ALTER TABLE public.flight_request RENAME COLUMN "endDate" TO end_date;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'flight_request'
      AND column_name  = 'takeoffTime'
  )
  THEN
    ALTER TABLE public.flight_request RENAME COLUMN "takeoffTime" TO takeoff_time;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'flight_request'
      AND column_name  = 'landingTime'
  )
  THEN
    ALTER TABLE public.flight_request RENAME COLUMN "landingTime" TO landing_time;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'flight_request'
      AND column_name  = 'geomType'
  )
  THEN
    ALTER TABLE public.flight_request RENAME COLUMN "geomType" TO geom_type;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'flight_request'
      AND column_name  = 'maxAltitude'
  )
  THEN
    ALTER TABLE public.flight_request RENAME COLUMN "maxAltitude" TO max_altitude;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'flight_request'
      AND column_name  = 'minAltitude'
  )
  THEN
    ALTER TABLE public.flight_request RENAME COLUMN "minAltitude" TO min_altitude;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'flight_request'
      AND column_name  = 'uavType'
  )
  THEN
    ALTER TABLE public.flight_request RENAME COLUMN "uavType" TO uav_type;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'flight_request'
      AND column_name  = 'createdAt'
  )
  THEN
    ALTER TABLE public.flight_request RENAME COLUMN "createdAt" TO created_at;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'flight_request'
      AND column_name  = 'updatedAt'
  )
  THEN
    ALTER TABLE public.flight_request RENAME COLUMN "updatedAt" TO updated_at;
  END IF;
END
$$;

/* ──────────────────────────────────────────────────────────────── */
/* 2. Добавляем недостающие столбцы (idempotent – IF NOT EXISTS)   */
/* ──────────────────────────────────────────────────────────────── */
ALTER TABLE public.flight_request
  ADD COLUMN IF NOT EXISTS name           TEXT,
  ADD COLUMN IF NOT EXISTS start_date     DATE,
  ADD COLUMN IF NOT EXISTS end_date       DATE,
  ADD COLUMN IF NOT EXISTS takeoff_time   TIME,
  ADD COLUMN IF NOT EXISTS landing_time   TIME,
  ADD COLUMN IF NOT EXISTS geom_type      TEXT,
  ADD COLUMN IF NOT EXISTS max_altitude   INTEGER,
  ADD COLUMN IF NOT EXISTS min_altitude   INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS uav_type       TEXT,
  ADD COLUMN IF NOT EXISTS purpose        TEXT,
  ADD COLUMN IF NOT EXISTS vlos           BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS status         TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS created_at     TIMESTAMP NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMP NOT NULL DEFAULT now();

/* ──────────────────────────────────────────────────────────────── */
/* 3. Триггер auto-update поля updated_at                           */
/* ──────────────────────────────────────────────────────────────── */
CREATE OR REPLACE FUNCTION set_fr_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_fr_updated ON public.flight_request;
CREATE TRIGGER trg_fr_updated
BEFORE UPDATE ON public.flight_request
FOR EACH ROW EXECUTE FUNCTION set_fr_updated_at();