"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

// Match GIS's outline/large/rectangular button without overriding its iframe.
export function AdminOAuthButton({ provider, children, ...props }: Omit<ComponentProps<typeof Button>, "variant" | "className" | "type"> & { provider: "google" | "apple" }) {
  return (
    <Button type="button" variant="outline" className="group h-10 w-full gap-2 rounded-sm border-oauth-border bg-white px-3 py-0 font-[Roboto,Arial,sans-serif] text-sm leading-5 font-medium tracking-[0.015625rem] text-oauth-ink shadow-none hover:bg-oauth-hover hover:text-oauth-ink disabled:opacity-100" {...props}>
      <span className="flex size-4.5 shrink-0 items-center justify-center group-disabled:opacity-50 [&_svg]:size-4.5">
        {provider === "google" ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.3 2.98-7.36Z" />
            <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.12H3.06v2.59A10 10 0 0 0 12 22Z" />
            <path fill="#FBBC05" d="M6.4 13.92a6 6 0 0 1 0-3.84V7.49H3.06a10 10 0 0 0 0 9.02l3.34-2.59Z" />
            <path fill="#EA4335" d="M12 5.96c1.47 0 2.79.5 3.82 1.49l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.94 5.49l3.34 2.59C7.19 7.72 9.4 5.96 12 5.96Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
          </svg>
        )}
      </span>
      <span className="min-w-0 flex-1 truncate text-center group-disabled:opacity-50">{children ?? `Sign in with ${provider === "google" ? "Google" : "Apple"}`}</span>
    </Button>
  );
}
