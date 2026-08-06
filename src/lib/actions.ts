"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!nombre || !email || !password) {
    redirect("/login?error=" + encodeURIComponent("Completá todos los campos."));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre } },
  });

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  if (!data.session) {
    redirect(
      "/login?message=" +
        encodeURIComponent(
          "Cuenta creada. Revisá tu email para confirmarla antes de entrar."
        )
    );
  }

  redirect("/");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const mensaje =
      error.code === "email_not_confirmed"
        ? "Tu cuenta todavía no fue confirmada. Revisá tu email, o pedile a quien administra Supabase que la confirme."
        : "Email o contraseña incorrectos.";
    redirect("/login?error=" + encodeURIComponent(mensaje));
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function addGasto(formData: FormData) {
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const monto = Number(formData.get("monto"));
  const categoria = String(formData.get("categoria") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "").trim();

  if (!categoria || !fecha || Number.isNaN(monto) || monto <= 0) {
    throw new Error("Datos de gasto inválidos");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const nombre =
    (user.user_metadata?.nombre as string | undefined) ?? user.email ?? "Usuario";

  const { error } = await supabase.from("gastos").insert({
    descripcion,
    monto,
    categoria,
    fecha,
    user_id: user.id,
    usuario_nombre: nombre,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export async function updateGasto(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const monto = Number(formData.get("monto"));
  const categoria = String(formData.get("categoria") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "").trim();

  if (!id || !categoria || !fecha || Number.isNaN(monto) || monto <= 0) {
    throw new Error("Datos de gasto inválidos");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("gastos")
    .update({ descripcion, monto, categoria, fecha })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect("/");
}

export async function deleteGasto(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Falta el id del gasto");

  const supabase = await createClient();
  const { error } = await supabase.from("gastos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
}
