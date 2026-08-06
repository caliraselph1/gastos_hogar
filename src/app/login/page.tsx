import { signIn, signUp } from "@/lib/actions";

const inputClass =
  "rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm text-black outline-none placeholder:text-zinc-400 focus:border-black dark:border-white/10 dark:text-zinc-50 dark:focus:border-white";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex max-w-sm flex-col px-4 py-10 sm:py-14">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Gastos del hogar
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Iniciá sesión para ver y cargar gastos.
          </p>
        </header>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            {message}
          </p>
        )}

        <form
          action={signIn}
          className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900"
        >
          <h2 className="text-sm font-medium text-black dark:text-zinc-50">
            Iniciar sesión
          </h2>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className={inputClass}
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            className={inputClass}
          />
          <button
            type="submit"
            className="mt-1 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Entrar
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-zinc-400">
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          ¿Primera vez acá?
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        </div>

        <form
          action={signUp}
          className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900"
        >
          <h2 className="text-sm font-medium text-black dark:text-zinc-50">
            Crear cuenta
          </h2>
          <input
            name="nombre"
            placeholder="Tu nombre"
            required
            className={inputClass}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className={inputClass}
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            required
            minLength={6}
            className={inputClass}
          />
          <button
            type="submit"
            className="mt-1 rounded-lg border border-black/10 px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/5 dark:border-white/10 dark:text-zinc-50 dark:hover:bg-white/10"
          >
            Crear cuenta
          </button>
        </form>
      </main>
    </div>
  );
}
