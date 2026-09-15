"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile: form.get("mobile"), password: form.get("password") }) });
    if (response.ok) router.replace("/admin");
    else setError((await response.json().catch(() => ({ error: "Unable to sign in." }))).error);
    setPending(false);
  }
  return <main className="admin-login"><form className="admin-login-card" onSubmit={submit}><div className="admin-login-brand"><Image src="/images/app-logo.svg" width={38} height={38} alt="Ekipma" /><span>ekipma<span>.</span></span></div><div><div className="admin-section-kicker">INTERNAL ACCESS</div><h1>Admin sign in</h1><p>Use an account assigned the Ekipma Admin role.</p></div><label>Mobile number<Input name="mobile" type="tel" autoComplete="tel" placeholder="+98 912 000 0000" required /></label><label>Password<Input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="admin-login-error" role="alert">{error}</p>}<Button type="submit" disabled={pending}>{pending ? "Signing in…" : <><LockKeyhole /> Sign in securely</>}</Button></form></main>;
}
