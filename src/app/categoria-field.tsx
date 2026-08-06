"use client";

import { useState } from "react";

const optionClass = "text-black bg-white";

const inputClass =
  "rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-black dark:border-white/10 dark:text-zinc-50 dark:focus:border-white";

export function CategoriaField({
  categorias,
  valorInicial = "",
}: {
  categorias: string[];
  valorInicial?: string;
}) {
  const [nueva, setNueva] = useState(
    valorInicial !== "" && !categorias.includes(valorInicial)
  );

  if (nueva) {
    return (
      <label className="col-span-2 flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        Categoría nueva
        <div className="flex gap-1.5">
          <input
            name="categoria"
            placeholder="Ej: Educación"
            required
            autoFocus
            defaultValue={
              valorInicial && !categorias.includes(valorInicial)
                ? valorInicial
                : ""
            }
            className={`min-w-0 flex-1 ${inputClass}`}
          />
          <button
            type="button"
            onClick={() => setNueva(false)}
            className="shrink-0 rounded-lg border border-black/10 px-2 text-xs text-zinc-500 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
          >
            Cancelar
          </button>
        </div>
      </label>
    );
  }

  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
      Categoría
      <select
        name="categoria"
        required
        defaultValue={valorInicial}
        onChange={(e) => {
          if (e.target.value === "__nueva__") setNueva(true);
        }}
        className={inputClass}
      >
        <option value="" disabled className={optionClass}>
          Elegir...
        </option>
        {categorias.map((c) => (
          <option key={c} value={c} className={optionClass}>
            {c}
          </option>
        ))}
        <option value="__nueva__" className={optionClass}>
          + Nueva categoría...
        </option>
      </select>
    </label>
  );
}
