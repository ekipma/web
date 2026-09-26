"use client";

import { useEffect, useRef } from "react";
import { AdminOAuthButton } from "./admin-oauth-button";

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
    <div className="grid gap-2">
      <AdminOAuthButton provider="apple" disabled={!enabled || pending} aria-describedby={!enabled ? "apple-sign-in-availability" : undefined} onClick={() => void signIn()} />
      {!enabled && (
        <p id="apple-sign-in-availability" className="text-center text-xs text-admin-ink-muted">
          Coming soon
        </p>
      )}
    </div>
  );
}
