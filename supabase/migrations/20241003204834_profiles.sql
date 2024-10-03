CREATE TABLE public.profiles (
  id uuid not null references auth.users on delete cascade,
  google_access_token text,
  google_refresh_token text,

  primary key (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
