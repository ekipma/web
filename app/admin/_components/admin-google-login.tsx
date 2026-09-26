"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type GoogleIdentity = {
  initialize(options: { client_id: string; nonce: string; callback: (response: { credential: string }) => void; ux_mode: "popup"; auto_select: boolean }): void;
  renderButton(element: HTMLElement, options: { type: "standard"; theme: "outline"; size: "large"; text: "signin_with"; shape: "rectangular"; locale: "en"; width: number }): void;
};

type Props = { clientId: string; pending: boolean; onPendingChange: (pending: boolean) => void; onError: (message: string) => void };

export function AdminGoogleLogin({ clientId, pending, onPendingChange, onError }: Props) {
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const preparing = useRef(false);
  const submitting = useRef(false);
  const mounted = useRef(true);
  const busy = useRef(pending);
  useEffect(() => {
    busy.current = pending;
  }, [pending]);
  const expiry = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "retry" | "script-error">("loading");

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (expiry.current) clearTimeout(expiry.current);
    };
  }, []);

  async function signIn(credential: string) {
    if (!mounted.current || busy.current || submitting.current) return;
    submitting.current = true;
    onPendingChange(true);
    onError("");
    if (expiry.current) clearTimeout(expiry.current);
    try {
      const response = await fetch("/api/admin/oauth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credential }),
        signal: AbortSignal.timeout(25_000),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Unable to sign in with Google.");
      router.replace("/admin");
      router.refresh();
    } catch (error) {
      if (mounted.current) {
        onError(error instanceof Error ? error.message : "Unable to sign in with Google.");
        setStatus("retry");
      }
    } finally {
      submitting.current = false;
      if (mounted.current) onPendingChange(false);
    }
  }

  async function prepare() {
    if (preparing.current || submitting.current) return;
    const identity = (window as Window & { google?: { accounts?: { id?: GoogleIdentity } } }).google?.accounts?.id;
    if (!identity) {
      setStatus("script-error");
      return;
    }
    preparing.current = true;
    setStatus("loading");
    if (expiry.current) clearTimeout(expiry.current);
    try {
      const response = await fetch("/api/admin/oauth/google/challenge", { method: "POST", signal: AbortSignal.timeout(15_000) });
      const data = await response.json().catch(() => null);
      if (!response.ok || typeof data?.nonce !== "string") throw new Error(data?.error || "Google sign-in is temporarily unavailable.");
      if (!mounted.current || !container.current) return;
      identity.initialize({
        client_id: clientId,
        nonce: data.nonce,
        callback: ({ credential }) => {
          void signIn(credential);
        },
        ux_mode: "popup",
        auto_select: false,
      });
      container.current.replaceChildren();
      identity.renderButton(container.current, { type: "standard", theme: "outline", size: "large", text: "signin_with", shape: "rectangular", locale: "en", width: Math.min(320, container.current.parentElement?.clientWidth || 250) });
      setStatus("ready");
      expiry.current = setTimeout(() => {
        if (mounted.current) setStatus("retry");
      }, 290_000);
    } catch (error) {
      if (mounted.current) {
        onError(error instanceof Error ? error.message : "Google sign-in is temporarily unavailable.");
        setStatus("retry");
      }
    } finally {
      preparing.current = false;
    }
  }

  return (
    <div className="grid min-w-0 gap-3">
      <Script
        src="https://accounts.google.com/gsi/client?hl=en"
        strategy="afterInteractive"
        onReady={() => {
          void prepare();
        }}
        onError={() => {
          setStatus("script-error");
        }}
      />
      {/* GIS renders its official accessible, branded button. This provider-owned
          control is the exception to our shadcn primitives; retry uses Button. */}
      <div ref={container} className={status === "ready" ? "flex min-h-10 justify-center" : "hidden"} inert={pending || status !== "ready"} />
      {status === "loading" && (
        <p role="status" className="text-center text-xs text-admin-ink-muted">
          Loading Google sign-in…
        </p>
      )}
      {status === "retry" && (
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => {
            void prepare();
          }}
        >
          Restart Google sign-in
        </Button>
      )}
      {status === "script-error" && (
        <p role="status" className="text-xs text-admin-ink-muted">
          Google sign-in couldn’t load. Reload the page or use your mobile and password.
        </p>
      )}
    </div>
  );
}
