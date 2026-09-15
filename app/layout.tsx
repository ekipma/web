import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "./globals.css";

const sans = localFont({
  src: "../public/fonts/Vazirmatn[wght].woff2",
  variable: "--font-sans-local",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ekipma.ir"),
  title: "Ekipma — Share expenses. Take turns. Make plans.",
  description:
    "Less sorting. More living. Ekipma brings shared expenses, rotating responsibilities, and plans together for friends, dorms, and roommates.",
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    title: "Ekipma — Less sorting. More living.",
    description:
      "Share expenses. Take turns. Make plans. A little less admin for your people.",
    type: "website",
    locale: "en_US",
    images: [
      { url: "/thumbnail.jpeg", width: 400, height: 225, alt: "Ekipma" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ekipma — Less sorting. More living.",
    description: "Share expenses. Take turns. Make plans.",
    images: ["/thumbnail.jpeg"],
  },
};
export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await headers()).get("x-ekipma-locale") === "fa" ? "fa" : "en";
  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"} className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
