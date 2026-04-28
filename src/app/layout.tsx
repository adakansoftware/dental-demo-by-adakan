import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getBaseUrl(),
  title: "Adakan Dental Klinik | Modern Diş Kliniği Demo",
  description: "Diş klinikleri için modern, mobil uyumlu, online randevu destekli web sitesi demosu.",
  verification: {
    google: "F9CjZoLhgyYJb2LPXCUGlNthcunJ53kN_RQqINd2ZUU",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
