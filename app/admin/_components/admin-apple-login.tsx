"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export function AdminAppleLogin({ enabled, pending, onPendingChange, onError }: { enabled: boolean; pending: boolean; onPendingChange: (pending: boolean) => void; onError: (message: string) => void }) {
  const busy = useRef(false);
  useEffect(() => {
    const reset = () => {
      busy.current = false;
      onPendingChange(false);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, [onPendingChange]);
  async function signIn() {
    if (!enabled || pending || busy.current) return;
    busy.current = true;
    onPendingChange(true);
    onError("");
    try {
      const response = await fetch("/api/admin/oauth/apple", { method: "POST", signal: AbortSignal.timeout(15_000) });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Unable to sign in with Apple.");
      const url = new URL(data.authorizationUrl);
      if (url.origin !== "https://appleid.apple.com" || url.pathname !== "/auth/authorize") throw new Error("Invalid Apple sign-in response.");
      window.location.assign(url.toString());
    } catch (error) {
      onError(error instanceof Error ? error.message : "Unable to sign in with Apple.");
      busy.current = false;
      onPendingChange(false);
    }
  }
  return (
    <Button className="h-10" type="button" variant="outline" disabled={!enabled || pending} onClick={() => void signIn()}>
      Sign in with Apple {!enabled && <span className="text-xs">(Coming soon)</span>}
    </Button>
  );
}
