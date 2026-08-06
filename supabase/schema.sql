-- Ejecutar en Supabase: Panel del proyecto > SQL Editor > New query > pegar > Run

create table if not exists gastos (
  id uuid primary key default gen_random_uuid(),
  descripcion text not null,
  monto numeric(10, 2) not null,
  categoria text not null,
  fecha date not null default current_date,
  created_at timestamptz not null default now()
);

-- Habilita RLS (Row Level Security). Sin esto, cualquiera con la anon key
-- podria leer/escribir la tabla directo, sin pasar por tu app.
alter table gastos enable row level security;

-- Politica temporal para poder probar la conexion antes de tener login.
-- Cuando agreguemos autenticacion, esta politica se reemplaza por una
-- que solo permita al usuario ver/editar sus propios gastos.
create policy "Permitir todo por ahora"
  on gastos
  for all
  using (true)
  with check (true);
