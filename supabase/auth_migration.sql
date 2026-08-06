-- Ejecutar en Supabase: Panel del proyecto > SQL Editor > New query > pegar > Run
-- Agrega quién cargó cada gasto y actualiza los permisos para que sea
-- obligatorio estar logueado.

alter table gastos add column if not exists user_id uuid references auth.users(id);
alter table gastos add column if not exists usuario_nombre text;

drop policy if exists "Permitir todo por ahora" on gastos;

-- Cualquier usuario logueado puede ver todos los gastos del hogar.
create policy "Ver gastos (logueado)"
  on gastos for select
  using (auth.uid() is not null);

-- Solo se puede crear un gasto a nombre de uno mismo.
create policy "Crear gasto propio (logueado)"
  on gastos for insert
  with check (auth.uid() = user_id);

-- Cualquier usuario logueado puede editar o borrar gastos (transparencia
-- del hogar: cualquiera puede corregir un error de otro miembro).
create policy "Editar gastos (logueado)"
  on gastos for update
  using (auth.uid() is not null);

create policy "Borrar gastos (logueado)"
  on gastos for delete
  using (auth.uid() is not null);
