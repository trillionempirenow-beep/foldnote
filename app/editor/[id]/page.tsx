import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditorShell } from "@/components/editor/EditorShell";
import type { EditorPage } from "@/lib/types/editor";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("id, title, owner_id")
    .eq("id", id)
    .single();

  if (!project || project.owner_id !== user.id) notFound();

  let { data: pages } = await supabase
    .from("pages")
    .select("id, position, canvas_json, background_id")
    .eq("project_id", id)
    .order("position", { ascending: true });

  if (!pages || pages.length === 0) {
    const { data: created } = await supabase
      .from("pages")
      .insert({ project_id: id, position: 0, canvas_json: {} })
      .select("id, position, canvas_json, background_id")
      .single();
    pages = created ? [created] : [];
  }

  if (!pages || pages.length === 0) notFound();

  return (
    <EditorShell
      project={{ id: project.id, title: project.title, owner_id: project.owner_id }}
      initialPages={pages as EditorPage[]}
    />
  );
}
