import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Ekipma Admin",
  description: "Internal Ekipma operations console.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell min-h-screen bg-[#0c0d10] text-foreground">{children}</div>;
}
