"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminGoogleLogin } from "./admin-google-login";

export function AdminLogin({ googleClientId = "" }: { googleClientId?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile: form.get("mobile"), password: form.get("password") }), signal: AbortSignal.timeout(15_000) });
      if (response.ok) {
        router.replace("/admin");
        router.refresh();
      } else setError((await response.json().catch(() => ({ error: "Unable to sign in." }))).error);
    } catch {
      setError("Unable to reach the sign-in service. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <main className="grid min-h-screen place-items-center bg-background bg-[radial-gradient(circle_at_50%_0,#a18fff18,transparent_36%)] p-6">
      <form method="post" action="/admin/login" className="grid w-full max-w-sm gap-5.5 rounded-2xl border border-input bg-card p-7.5 shadow-2xl" onSubmit={submit}>
        <div className="flex items-center gap-2.5 text-[1.375rem] font-[750] tracking-[-0.0625rem] text-admin-ink">
          <Image className="grayscale" src="/images/app-logo.svg" width={38} height={38} alt="Ekipma" />
          <span>
            ekipma<span className="text-admin-violet">.</span>
          </span>
        </div>
        <div>
          <div className="font-[Arial,sans-serif] text-[0.5625rem] leading-normal font-bold tracking-[0.078rem] text-admin-ink-faint">INTERNAL ACCESS</div>
          <h1 className="mt-2 mb-1.5 text-2xl tracking-[-0.0625rem]">Admin sign in</h1>
          <p className="text-xs leading-[1.6] text-admin-ink-muted">Use an account assigned the Ekipma Admin role.</p>
        </div>
        <label className="grid gap-2 text-[0.6875rem] font-semibold text-admin-ink-muted">
          Mobile number
          <Input className="h-10" name="mobile" type="tel" autoComplete="tel" placeholder="+98 912 000 0000" required />
        </label>
        <label className="grid gap-2 text-[0.6875rem] font-semibold text-admin-ink-muted">
          Password
          <Input className="h-10" name="password" type="password" autoComplete="current-password" required />
        </label>
        {error && (
          <p className="rounded-lg border border-admin-rose/30 bg-admin-rose-soft px-2.5 py-2.5 text-xs leading-[1.6] text-admin-rose" role="alert">
            {error}
          </p>
        )}
        <Button className="h-10 [&_svg]:w-4" type="submit" disabled={pending}>
          {pending ? (
            "Signing in…"
          ) : (
            <>
              <LockKeyhole /> Sign in securely
            </>
          )}
        </Button>
        {googleClientId && <AdminGoogleLogin clientId={googleClientId} pending={pending} onPendingChange={setPending} onError={setError} />}
      </form>
    </main>
  );
}
