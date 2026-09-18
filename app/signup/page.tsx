"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/ui/AuthShell";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { GoogleButton } from "@/components/ui/GoogleButton";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setCheckEmail(true);
    }
  }

  async function handleGoogleSignup() {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  }

  if (checkEmail) {
    return (
      <AuthShell
        eyebrow="almost there"
        title="Check Your Inbox"
        subtitle=""
        footer={
          <Link href="/login" className="text-rose underline decoration-dotted">
            Open Your Scrapbook
          </Link>
        }
      >
        <p className="text-center font-[family-name:var(--font-nunito)] text-sm text-ink/70">
          We sent a little note to <strong>{email}</strong> — open it to
          confirm your account.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="no design skills needed"
      title="Start Your First Scrapbook"
      subtitle="Just memories."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-rose underline decoration-dotted">
            Open Your Scrapbook
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <GoogleButton onClick={handleGoogleSignup} disabled={loading} />

        <div className="flex items-center gap-3 py-1 text-xs text-ink/40">
          <span className="h-px flex-1 bg-ink/10" />
          or
          <span className="h-px flex-1 bg-ink/10" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <Field
            label="Name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What should we call you?"
          />
          <Field
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Field
            label="Password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
          {error && (
            <p className="rounded-md bg-rose/10 px-3 py-2 text-sm text-rose">
              {error}
            </p>
          )}
          <Button
            type="submit"
            variant="primary"
            className="w-full rotate-0"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create My Scrapbook"}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
