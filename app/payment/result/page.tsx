import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Payment result | Ekipma",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

type PurchaseResult = { quantity: string; status: string };

async function readResult(purchase: string, receipt: string): Promise<PurchaseResult | null> {
  const apiBase = process.env.EKIPMA_API_URL;
  if (!apiBase || !purchase || !receipt) return null;
  const url = new URL(`/payments/token-purchases/${encodeURIComponent(purchase)}/result`, apiBase);
  url.searchParams.set("receipt", receipt);
  const response = await fetch(url, { cache: "no-store" }).catch(() => null);
  if (!response?.ok) return null;
  return response.json().catch(() => null);
}

function presentation(result: PurchaseResult | null) {
  if (result?.status === "paid") {
    return { tone: "success", title: "Payment completed", body: `${result.quantity} token${result.quantity === "1" ? "" : "s"} added to your Ekipma balance.` };
  }
  if (result?.status === "failed" || result?.status === "amount_mismatch") {
    return { tone: "failure", title: "Payment was not completed", body: "No tokens were added. You can return to Ekipma and try again." };
  }
  if (result?.status === "pending" || result?.status === "created") {
    return { tone: "pending", title: "Checking your payment", body: "We are confirming the payment with Zibal. This page will refresh shortly." };
  }
  return { tone: "failure", title: "We could not find this payment", body: "The result link may have expired. Open Ekipma to check your token balance." };
}

export default async function PaymentResult({ searchParams }: { searchParams: Promise<{ purchase?: string; receipt?: string }> }) {
  const { purchase = "", receipt = "" } = await searchParams;
  const result = await readResult(purchase, receipt);
  const view = presentation(result);
  const refresh = view.tone === "pending";
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_50%_0%,#30264f_0%,var(--background)_48%)] p-6">
      {refresh && <meta httpEquiv="refresh" content="4" />}
      <section className="max-w-112.5 rounded-3xl border border-line bg-[#121217] px-8.5 py-11 text-center shadow-[0_24px_80px_#0008]" aria-live="polite">
        <span
          className={cn("inline-flex size-14 items-center justify-center rounded-full border text-[28px] font-bold", {
            "border-[#2ebf9155] bg-[#2ebf9120] text-plan": view.tone === "success",
            "border-[#e9438c55] bg-[#e9438c20] text-pay": view.tone === "failure",
            "border-[#a18fff55] bg-[#a18fff20] text-lavender": view.tone === "pending",
          })}
          aria-hidden="true"
        >
          {view.tone === "success" ? "✓" : view.tone === "pending" ? "…" : "!"}
        </span>
        <p className="mt-6 text-[11px] font-bold tracking-[1.5px] text-site-muted">EKIPMA PAYMENT</p>
        <h1 className="mt-3 text-[clamp(28px,5vw,38px)] leading-[1.1]">{view.title}</h1>
        <p className="mx-auto mt-3.5 max-w-82.5 leading-[1.7] text-site-muted">{view.body}</p>
        <div className="mt-7.5 flex flex-col items-center gap-4">
          <Link href="/fa" className="w-full rounded-[12px] bg-lavender px-5 py-[13px] font-[750] text-[#17151f]">
            Return to Ekipma
          </Link>
          {refresh && (
            <Link href={`/payment/result?purchase=${encodeURIComponent(purchase)}&receipt=${encodeURIComponent(receipt)}`} className="text-[14px] text-site-muted underline underline-offset-4">
              Refresh now
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
