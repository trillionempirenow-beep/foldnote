import { createClient } from "@/lib/supabase/server";
import { createProject } from "@/lib/actions/projects";
import { PinnedCard } from "@/components/dashboard/PinnedCard";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, status, updated_at")
    .eq("owner_id", user!.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="px-8 py-10 sm:px-12">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-caveat)] text-4xl text-ink">
            Your Corkboard
          </h1>
          <p className="mt-1 font-[family-name:var(--font-nunito)] text-sm text-ink/60">
            Every keepsake you&apos;ve started, pinned right here.
          </p>
        </div>
        <form action={createProject}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-rose px-6 py-3 font-[family-name:var(--font-quicksand)] font-semibold text-paper shadow-[0_4px_0_0_#9c5a5e] transition-all hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#9c5a5e]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Begin Your Pages
          </button>
        </form>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p, i) => (
            <PinnedCard
              key={p.id}
              id={p.id}
              title={p.title}
              status={p.status as "draft" | "published"}
              updatedAt={p.updated_at}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-ink/15 py-24 text-center">
          <p className="font-[family-name:var(--font-caveat)] text-2xl text-ink/60">
            Your corkboard is empty — for now.
          </p>
          <p className="mt-2 font-[family-name:var(--font-nunito)] text-sm text-ink/50">
            Pin your first memory to get started.
          </p>
        </div>
      )}
    </div>
  );
}
