import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="px-8 py-10 sm:px-12">
      <h1 className="font-[family-name:var(--font-caveat)] text-4xl text-ink">
        Settings
      </h1>
      <div className="mt-8 max-w-md rounded-lg border border-ink/10 bg-white/60 p-6 paper-shadow">
        <p className="font-[family-name:var(--font-quicksand)] text-sm font-medium text-ink/50">
          Signed in as
        </p>
        <p className="mt-1 font-[family-name:var(--font-nunito)] text-ink">
          {user?.email}
        </p>
      </div>
      <p className="mt-6 font-[family-name:var(--font-nunito)] text-sm text-ink/50">
        Profile editing, password changes, and notification preferences are
        coming in a later phase.
      </p>
    </div>
  );
}
