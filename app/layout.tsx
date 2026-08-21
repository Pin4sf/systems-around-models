import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import { PublicationShell } from "@/components/publication-shell";
import "./globals.css";

const displayFont = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
});

const interfaceFont = Inter({
  subsets: ["latin"],
  variable: "--font-interface",
});

const traceFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-trace",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Systems Around Models",
  description: "Independent research on systems around models.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${interfaceFont.variable} ${traceFont.variable}`}
    >
      <body>
        <PublicationShell>{children}</PublicationShell>
      </body>
    </html>
  );
}
