"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AdminAsset } from "@/lib/admin-api";
import { Check, PackagePlus, Power, RefreshCw } from "lucide-react";

function responseMessage(body: unknown, fallback: string) {
  if (body && typeof body === "object" && "error" in body) {
    const error = body.error;
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "code" in error && typeof error.code === "string") return error.code;
  }
  return fallback;
}

export function AssetsPanel({ initial }: { initial: AdminAsset[] | null }) {
  const [assets, setAssets] = useState(initial ?? []);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (initial === null) {
    return (
      <section role="alert" className="grid gap-6">
        <PageHeading />
        <Card>
          <CardHeader>
            <CardTitle>Catalog unavailable</CardTitle>
            <CardDescription>The asset catalog could not be loaded. Try again to refresh the page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw /> Retry
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  async function create() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: Number(price), active: true }),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(responseMessage(body, "Could not add asset"));
      setAssets((current) => [...current, body as AdminAsset]);
      setName("");
      setPrice("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not add asset");
    } finally {
      setBusy(false);
    }
  }

  async function update(asset: AdminAsset, values: Pick<Partial<AdminAsset>, "price" | "active">) {
    setError("");
    try {
      const response = await fetch(`/api/admin/assets/${asset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(responseMessage(body, "Could not update asset"));
      setAssets((current) => current.map((item) => (item.id === asset.id ? (body as AdminAsset) : item)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update asset");
    }
  }

  return (
    <section className="grid gap-5">
      <PageHeading />
      {error && (
        <div role="alert" className="rounded-lg border border-admin-rose/35 bg-admin-rose-soft px-4 py-3 text-sm text-admin-rose">
          {error}
        </div>
      )}
      <Card>
        <CardHeader className="gap-4 border-b border-admin-line sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Add an asset</CardTitle>
            <CardDescription>New names need matching bundled visuals in the mobile app.</CardDescription>
          </div>
          <Badge variant="outline">{assets.length} catalog items</Badge>
        </CardHeader>
        <CardContent className="pt-5">
          <form
            className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              void create();
            }}
          >
            <Input required pattern="[a-z][a-z0-9_]{0,63}" title="Lowercase letters, numbers, and underscores" placeholder="Asset name, for example neon_frame" value={name} onChange={(event) => setName(event.target.value)} />
            <Input required min="0" step="1" type="number" placeholder="Price in tokens" value={price} onChange={(event) => setPrice(event.target.value)} />
            <Button disabled={busy} type="submit">
              <PackagePlus /> {busy ? "Adding…" : "Add asset"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="overflow-x-auto p-1 max-mobile:px-0">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead>
              <tr className="border-b border-admin-line text-xs font-medium tracking-wide text-admin-ink-muted uppercase">
                <th className="px-5 py-3">Asset</th>
                <th className="px-5 py-3">Catalog ID</th>
                <th className="px-5 py-3">Token price</th>
                <th className="px-5 py-3">Availability</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} className="border-b border-admin-line transition-colors last:border-0 hover:bg-admin-panel-soft">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-lg bg-admin-violet-soft text-admin-violet">
                        <PackagePlus className="size-4" />
                      </span>
                      <strong className="font-medium text-admin-ink-soft">{asset.name}</strong>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-admin-ink-faint">{asset.id}</td>
                  <td className="px-5 py-4">
                    <input
                      key={`${asset.id}:${asset.price}`}
                      aria-label={`${asset.name} price`}
                      type="number"
                      min="0"
                      step="1"
                      defaultValue={asset.price}
                      onBlur={(event) => {
                        const next = Number(event.target.value);
                        if (Number.isSafeInteger(next) && next >= 0 && next !== asset.price) void update(asset, { price: next });
                        else event.target.value = String(asset.price);
                      }}
                      className="h-8 w-24 rounded-md border border-input bg-transparent px-2 text-sm text-admin-ink-soft outline-none focus-visible:ring-2 focus-visible:ring-admin-violet"
                    />
                    <span className="ml-2 text-xs text-admin-ink-muted">tokens</span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={asset.active ? "success" : "warning"}>
                      {asset.active && <Check className="size-3" />}
                      {asset.active ? "On sale" : "Hidden"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button type="button" variant="outline" size="sm" onClick={() => void update(asset, { active: !asset.active })}>
                      <Power /> {asset.active ? "Hide" : "Publish"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
}

function PageHeading() {
  return (
    <div className="flex items-end justify-between gap-6 max-mobile:grid max-mobile:items-start [&_h1]:mt-2 [&_h1]:mb-1.5 [&_h1]:text-[1.6875rem] [&_h1]:font-semibold [&_h1]:tracking-[-0.069rem] [&_h1]:text-admin-ink [&_p]:text-xs [&_p]:text-admin-ink-muted">
      <div>
        <div className="font-sans text-[0.5625rem] leading-normal font-bold tracking-[0.078rem] text-admin-ink-faint">CATALOG</div>
        <h1>Assets</h1>
        <p>Set token prices and control what users can buy.</p>
      </div>
    </div>
  );
}
