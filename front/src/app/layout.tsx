import type { Metadata } from 'next';
import { Josefin_Sans, Karla } from "next/font/google";
import "./globals.css";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-josefin",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-karla",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Ticket Tout',
  description: 'Gérez vos avantages collaborateurs simplement.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning
      className={`${josefinSans.variable} ${karla.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50">
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