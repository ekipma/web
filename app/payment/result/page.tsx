import type { Metadata } from "next";
import Link from "next/link";

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
    <main className="payment-result" data-tone={view.tone}>
      {refresh && <meta httpEquiv="refresh" content="4" />}
      <section className="payment-result-card" aria-live="polite">
        <span className="payment-mark" aria-hidden="true">{view.tone === "success" ? "✓" : view.tone === "pending" ? "…" : "!"}</span>
        <p className="payment-result-label">EKIPMA PAYMENT</p>
        <h1>{view.title}</h1>
        <p>{view.body}</p>
        <div className="payment-result-actions">
          <Link href="/fa" className="payment-result-button">Return to Ekipma</Link>
          {refresh && <Link href={`/payment/result?purchase=${encodeURIComponent(purchase)}&receipt=${encodeURIComponent(receipt)}`} className="payment-result-retry">Refresh now</Link>}
        </div>
      </section>
    </main>
  );
}
