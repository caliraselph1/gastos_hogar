import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateGasto } from "@/lib/actions";
import { CATEGORIAS } from "@/lib/categorias";
import { CategoriaField } from "@/app/categoria-field";

const inputClass =
  "rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-black dark:border-white/10 dark:text-zinc-50 dark:focus:border-white";

export default async function EditarGastoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: gasto, error } = await supabase
    .from("gastos")
    .select("*")
    .eq("id", id)
    .single();

  const { data: todos } = await supabase.from("gastos").select("categoria");
  const categorias = Array.from(
    new Set([...CATEGORIAS, ...(todos ?? []).map((g) => g.categoria)])
  );

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-xl px-4 py-10 sm:py-14">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          <span aria-hidden>✏️</span> Editar gasto
        </h1>

        {error || !gasto ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            No se encontró el gasto.
          </p>
        ) : (
          <form
            action={updateGasto}
            className="mt-6 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900"
          >
            <input type="hidden" name="id" value={gasto.id} />

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Monto
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-400">
                    $
                  </span>
                  <input
                    name="monto"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={gasto.monto}
                    className={`${inputClass} pl-6`}
                  />
                </div>
              </label>

              <CategoriaField
                categorias={categorias}
                valorInicial={gasto.categoria}
              />

              <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Fecha
                <input
                  name="fecha"
                  type="date"
                  required
                  defaultValue={gasto.fecha}
                  className={inputClass}
                />
              </label>

              <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Descripción (opcional)
                <input
                  name="descripcion"
                  defaultValue={gasto.descripcion}
                  className={inputClass}
                />
              </label>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Guardar cambios
              </button>
              <Link
                href="/"
                className="flex items-center rounded-lg border border-black/10 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/10"
              >
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
