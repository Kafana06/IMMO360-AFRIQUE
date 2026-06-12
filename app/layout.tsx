import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-title",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IMMO360 AFRIQUE | SaaS de Gestion Immobilière Premium",
  description: "Le système d'exploitation immobilier de l'Afrique. Gestion locative multi-locataires (multi-tenant) pour agences, promoteurs, syndics et bailleurs en Côte d'Ivoire, Sénégal, Cameroun, Bénin, Togo et Burkina Faso. Intégrations Mobile Money (Orange, MTN, Moov, Wave) et notifications WhatsApp.",
  keywords: "proptech afrique, gestion locative, mobile money mtn orange wave, syndic, promoteur immobilier, OHADA, cote d'ivoire logements sociaux, dakar abidjan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-neutral-bg text-primary">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
