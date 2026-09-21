import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPRITZ OPS",
  description: "Producție, stoc, cost și relații comerciale SPRITZ.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
