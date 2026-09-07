import type { Metadata } from 'next';
import localFont from "next/font/local";
import { Spectral } from "next/font/google";
import "./globals.css";

const marianne = localFont({
  src: [
    { path: "../fonts/Marianne-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Marianne-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-marianne",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-spectral",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Carte Pro',
  description: 'Gérez vos avantages collaborateurs simplement.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning
      className={`${marianne.variable} ${spectral.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 font-spectral">
        <div className="flex-1">
          {children}
        </div>
        <footer className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-500">
          Démonstrateur technique, ne constitue pas un service public en exploitation.
        </footer>
      </body>
    </html>
  );
}