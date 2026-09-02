import localFont from "next/font/local";
import { Spectral } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr"
      className={`${marianne.variable} ${spectral.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
     </body>
    </html>
  );
}