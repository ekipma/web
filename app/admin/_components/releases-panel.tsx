"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Release = { version: string; size: number; publishedAt: string; url: string };
type Upload = { key: string; url: string; fields: Record<string, string> };
const maxBytes = 200 * 1024 * 1024;

async function api(path = "", body?: unknown) {
  const response = await fetch(`/api/admin/releases${path}`, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : { cache: "no-store" });
  if (!response.ok) {
    if (response.status === 401) throw new Error("Your session expired. Sign in again and retry.");
    if (response.status === 422) throw new Error("Check the version and upload a valid signed APK under 200 MiB.");
    throw new Error("Release storage is unavailable or the operation failed. Refresh the current release before retrying publication.");
  }
  return response.json();
}

export function ReleasesPanel({ initial }: { initial: { release: Release | null } | null }) {
  const [release, setRelease] = useState<Release | null>(initial?.release ?? null);
  const [ready, setReady] = useState(initial !== null);
  const [version, setVersion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const uploadRequest = useRef<XMLHttpRequest | null>(null);
  const load = useCallback(async () => {
    try {
      const data = await api();
      setError("");
      setRelease(data.release);
      setReady(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load release.");
    }
  }, []);
  useEffect(() => () => uploadRequest.current?.abort(), []);

  async function publish() {
    if (busy || !file) return;
    setError("");
    if (!file.name.toLowerCase().endsWith(".apk") || file.size === 0 || file.size > maxBytes) {
      setError("Choose a nonempty APK file no larger than 200 MiB.");
      return;
    }
    setBusy(true);
    setStatus("Preparing upload…");
    try {
      const upload: Upload = await api("/uploads", { version, size: file.size });
      const form = new FormData();
      Object.entries(upload.fields).forEach(([key, value]) => form.append(key, value));
      form.append("file", file);
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        uploadRequest.current = xhr;
        xhr.open("POST", upload.url);
        xhr.timeout = 15 * 60 * 1000;
        xhr.upload.onprogress = (event) => setStatus(event.lengthComputable ? `Uploading ${Math.round((event.loaded / event.total) * 100)}%` : "Uploading…");
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed. Please retry.")));
        xhr.onerror = () => reject(new Error("Upload connection failed. Check your connection and retry."));
        xhr.ontimeout = () => reject(new Error("Upload timed out. Please retry."));
        xhr.onabort = () => reject(new Error("Upload cancelled."));
        xhr.send(form);
      });
      setStatus("Validating and publishing…");
      const published: Release = await api("/publish", { key: upload.key });
      setRelease(published);
      setStatus(`Version ${published.version} published. The website download is updated.`);
      setFile(null);
      setVersion("");
      if (input.current) input.current.value = "";
    } catch (cause) {
      setStatus("");
      setError(cause instanceof Error ? cause.message : "Publication failed.");
    } finally {
      setBusy(false);
      uploadRequest.current = null;
    }
  }

  return (
    <section className="grid max-w-3xl gap-5">
      <h1 className="text-2xl font-semibold text-admin-ink">App releases</h1>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Current Android release</CardTitle>
          <CardDescription>The website always downloads the latest published APK.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {ready ? (
            release ? (
              <>
                <p>
                  Version {release.version} · {(release.size / 1024 / 1024).toFixed(1)} MiB
                </p>
                <p className="text-sm text-muted-foreground">Published {new Date(release.publishedAt).toLocaleString("en-GB", { timeZone: "UTC" }) + " UTC"}</p>
                <Button asChild variant="outline">
                  <a href={release.url}>Download APK</a>
                </Button>
              </>
            ) : (
              <p>No APK has been published yet.</p>
            )
          ) : (
            <p>Release details are not loaded yet.</p>
          )}
          <Button variant="outline" disabled={busy} onClick={() => void load()}>
            Refresh current release
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Publish a new version</CardTitle>
          <CardDescription>Upload a signed Android release, up to 200 MiB. Publishing replaces the website download.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void publish();
            }}
          >
            <div className="grid gap-2">
              <label htmlFor="release-version">Version</label>
              <Input id="release-version" dir="ltr" required maxLength={64} pattern="[0-9]+\.[0-9]+\.[0-9]+([+\-][A-Za-z0-9.\-]+)?" placeholder="0.8.2" value={version} disabled={busy} onChange={(event) => setVersion(event.target.value)} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="release-apk">Signed APK</label>
              <Input ref={input} id="release-apk" type="file" accept=".apk,application/vnd.android.package-archive" required disabled={busy} onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </div>
            <Button type="submit" disabled={busy || !ready || !file}>
              {busy ? "Publishing…" : "Upload and publish"}
            </Button>
            <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
              {status}
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
