import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addGasto, deleteGasto, signOut } from "@/lib/actions";
import { CATEGORIAS, iconoDeCategoria, estiloDeCategoria } from "@/lib/categorias";
import { CategoriaField } from "./categoria-field";

const moneda = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const fechaLarga = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
});

function hoy() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function primerDiaMes() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function ultimoDiaMes() {
  const d = new Date();
  const ultimo = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    ultimo
  ).padStart(2, "0")}`;
}

const nombreMes = new Intl.DateTimeFormat("es-AR", {
  month: "long",
  year: "numeric",
}).format(new Date());

const inputClass =
  "rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-black dark:border-white/10 dark:text-zinc-50 dark:focus:border-white";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ desde?: string; hasta?: string; categoria?: string }>;
}) {
  const { desde = "", hasta = "", categoria: categoriaFiltro = "" } =
    await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Todas las categorías alguna vez usadas, sin aplicar filtros, para que
  // los desplegables no pierdan opciones cuando hay un filtro activo.
  const { data: todosLosGastos } = await supabase.from("gastos").select("categoria");
  const categorias = Array.from(
    new Set([...CATEGORIAS, ...(todosLosGastos ?? []).map((g) => g.categoria)])
  );

  let consulta = supabase
    .from("gastos")
    .select("*")
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false });

  if (desde) consulta = consulta.gte("fecha", desde);
  if (hasta) consulta = consulta.lte("fecha", hasta);
  if (categoriaFiltro) consulta = consulta.eq("categoria", categoriaFiltro);

  const { data: gastos, error } = await consulta;

  const cantidadGastos = (gastos ?? []).length;
  const total = (gastos ?? []).reduce((sum, g) => sum + Number(g.monto), 0);
  const hayFiltros = Boolean(desde || hasta || categoriaFiltro);

  const { data: gastosDelMes } = await supabase
    .from("gastos")
    .select("monto")
    .gte("fecha", primerDiaMes())
    .lte("fecha", ultimoDiaMes());

  const totalMes = (gastosDelMes ?? []).reduce(
    (sum, g) => sum + Number(g.monto),
    0
  );

  const nombre =
    (user?.user_metadata?.nombre as string | undefined) ?? user?.email ?? "";

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-xl px-4 py-10 sm:py-14">
        <header className="mb-8 flex items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              <span aria-hidden>🏠</span> Gastos del hogar
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Hola, {nombre}
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/10"
            >
              Salir
            </button>
          </form>
        </header>

        <section className="flex items-center gap-4 rounded-2xl bg-black p-5 text-white dark:bg-zinc-900 dark:ring-1 dark:ring-white/10">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl">
            💰
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Gastado este mes
            </p>
            <p className="mt-0.5 text-3xl font-semibold tabular-nums">
              ${moneda.format(totalMes)}
            </p>
            <p className="mt-0.5 text-xs capitalize text-zinc-400">{nombreMes}</p>
          </div>
        </section>

        <form
          action={addGasto}
          className="mt-6 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4"
              >
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
            </span>
            <h2 className="text-sm font-medium text-black dark:text-zinc-50">
              Agregar gasto
            </h2>
          </div>

          <div className="mt-4 flex flex-col gap-3">
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
                  placeholder="0.00"
                  required
                  className={`${inputClass} pl-6`}
                />
              </div>
            </label>

            <CategoriaField categorias={categorias} />

            <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Fecha
              <input
                name="fecha"
                type="date"
                required
                defaultValue={hoy()}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Descripción (opcional)
              <input
                name="descripcion"
                placeholder="Ej: Supermercado"
                className={inputClass}
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Agregar
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            No se pudieron cargar los gastos: {error.message}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Historial
          </h2>
          {hayFiltros && (
            <Link
              href="/"
              className="text-xs font-medium text-zinc-500 underline hover:text-black dark:hover:text-zinc-50"
            >
              Limpiar filtros
            </Link>
          )}
        </div>

        <form
          method="GET"
          action="/"
          className="mt-3 flex flex-wrap items-end gap-2 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900"
        >
          <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Desde
            <input
              type="date"
              name="desde"
              defaultValue={desde}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Hasta
            <input
              type="date"
              name="hasta"
              defaultValue={hasta}
              className={inputClass}
            />
          </label>
          <label className="flex min-w-[9rem] flex-1 flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Categoría
            <select
              name="categoria"
              defaultValue={categoriaFiltro}
              className={inputClass}
            >
              <option value="" className="bg-white text-black">
                Todas
              </option>
              {categorias.map((c) => (
                <option key={c} value={c} className="bg-white text-black">
                  {c}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.66 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z"
                clipRule="evenodd"
              />
            </svg>
            Filtrar
          </button>
        </form>

        <ul className="mt-3 divide-y divide-black/10 overflow-hidden rounded-2xl border border-black/10 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-zinc-900">
          {(gastos ?? []).map((g) => (
            <li
              key={g.id}
              className="flex items-center justify-between gap-3 px-5 py-3.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-black dark:text-zinc-50">
                  {g.descripcion || g.categoria}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${estiloDeCategoria(
                      g.categoria
                    )}`}
                  >
                    {iconoDeCategoria(g.categoria)} {g.categoria}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {fechaLarga.format(new Date(`${g.fecha}T00:00:00`))}
                  </span>
                  {g.usuario_nombre && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      <span className="flex size-4 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
                        {g.usuario_nombre.charAt(0).toUpperCase()}
                      </span>
                      {g.usuario_nombre}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span className="mr-1 text-sm font-medium tabular-nums text-black dark:text-zinc-50">
                  ${moneda.format(Number(g.monto))}
                </span>
                <Link
                  href={`/gastos/${g.id}/editar`}
                  aria-label="Editar gasto"
                  className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-black/5 hover:text-black dark:hover:bg-white/10 dark:hover:text-zinc-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793ZM11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.83-2.828Z" />
                  </svg>
                </Link>
                <form action={deleteGasto}>
                  <input type="hidden" name="id" value={g.id} />
                  <button
                    type="submit"
                    aria-label="Borrar gasto"
                    className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.75 1a.75.75 0 0 0-.75.75V3H4.5a.75.75 0 0 0 0 1.5h.322l.83 10.79A2.75 2.75 0 0 0 8.395 18h3.21a2.75 2.75 0 0 0 2.743-2.71l.83-10.79h.322a.75.75 0 0 0 0-1.5H12v-1.25a.75.75 0 0 0-.75-.75h-2.5ZM10 6.25a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0V7a.75.75 0 0 1 .75-.75Zm-2.25.75a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0V7Zm4.5 0a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0V7Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </li>
          ))}
          {cantidadGastos === 0 && !error && (
            <li className="px-5 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
              {hayFiltros
                ? "No hay gastos que coincidan con el filtro."
                : "Todavía no cargaste ningún gasto."}
            </li>
          )}
          {cantidadGastos > 0 && (
            <li className="flex items-center justify-between bg-zinc-50 px-5 py-3 dark:bg-zinc-800/60">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {cantidadGastos} {cantidadGastos === 1 ? "gasto" : "gastos"}
                {hayFiltros ? " (filtrado)" : ""}
              </span>
              <span className="text-sm font-semibold tabular-nums text-black dark:text-zinc-50">
                Total: ${moneda.format(total)}
              </span>
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}
