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
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile: form.get("mobile"), password: form.get("password") }) });
    if (response.ok) router.replace("/admin");
    else setError((await response.json().catch(() => ({ error: "Unable to sign in." }))).error);
    setPending(false);
  }
  return (
    <main className="grid min-h-screen place-items-center bg-background bg-[radial-gradient(circle_at_50%_0,#a18fff18,transparent_36%)] p-6">
      <form className="grid w-full max-w-[390px] gap-5.5 rounded-[14px] border border-[#30313a] bg-card p-7.5 shadow-[0_24px_70px_#00000045]" onSubmit={submit}>
        <div className="flex items-center gap-[9px] text-[22px] font-[750] tracking-[-1px] text-[#f6f5f9]">
          <Image className="grayscale" src="/images/app-logo.svg" width={38} height={38} alt="Ekipma" />
          <span>
            ekipma<span className="text-ring">.</span>
          </span>
        </div>
        <div>
          <div className="font-[Arial,sans-serif] text-[9px] leading-normal font-bold tracking-[1.25px] text-[#888998]">INTERNAL ACCESS</div>
          <h1 className="mt-2 mb-1.5 text-[25px] tracking-[-1px]">Admin sign in</h1>
          <p className="text-[12px] leading-[1.6] text-[#989aa5]">Use an account assigned the Ekipma Admin role.</p>
        </div>
        <label className="grid gap-[7px] text-[11px] font-semibold text-[#c6c7ce]">
          Mobile number
          <Input className="h-10" name="mobile" type="tel" autoComplete="tel" placeholder="+98 912 000 0000" required />
        </label>
        <label className="grid gap-[7px] text-[11px] font-semibold text-[#c6c7ce]">
          Password
          <Input className="h-10" name="password" type="password" autoComplete="current-password" required />
        </label>
        {error && (
          <p className="rounded-[7px] border border-[#e85c7b55] bg-[#e85c7b13] px-2.5 py-[9px] text-[12px] leading-[1.6] text-[#ff9bb4]" role="alert">
            {error}
          </p>
        )}
        <Button className="h-[41px] [&_svg]:w-[15px]" type="submit" disabled={pending}>
          {pending ? (
            "Signing in…"
          ) : (
            <>
              <LockKeyhole /> Sign in securely
            </>
          )}
        </Button>
      </form>
    </main>
  );
}
