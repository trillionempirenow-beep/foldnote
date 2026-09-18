"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createProject() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({ owner_id: user.id, title: "Untitled Keepsake" })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/dashboard?error=Could not start a new keepsake");
  }

  redirect(`/editor/${data.id}`);
}
