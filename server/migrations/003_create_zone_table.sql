DROP TABLE IF EXISTS public.zone;

CREATE TABLE public.zone (
  id   SERIAL PRIMARY KEY,                     
  name TEXT NOT NULL,                         
  geom geometry(Polygon,4326) NOT NULL         
);