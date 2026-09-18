import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { RoleProvider } from "@/hooks/useRole";
import { ScenarioProvider } from "@/context/ScenarioContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "GridWise — Smart Campus Energy Optimization Platform",
  description:
    "LLM-assisted campus energy scheduling and cost optimization engine for BUP CSE Fest 2026 Hackathon.",
  keywords: [
    "Energy Optimization",
    "Smart Campus",
    "BUP CSE Fest 2026",
    "GridWise",
    "LLM Directive Interpretation",
    "Battery Storage",
    "Solar PV",
  ],
  authors: [{ name: "GridWise Engineering Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0E0C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <RoleProvider>
            <ScenarioProvider>{children}</ScenarioProvider>
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
