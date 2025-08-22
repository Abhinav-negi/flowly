import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

// Primary font for body/content
const appFont = Inter({
  variable: "--font-app",
  subsets: ["latin"],
  display: "swap",
});

// Secondary font for headings
const secondaryFont = Playfair_Display({
  variable: "--font-secondary",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flowly",
  description: "Join Flowly and find love beyond first sight.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1"
        />
        <meta name="theme-color" content="#E05265" />
      </head>
      <body
        className={`${appFont.variable} ${secondaryFont.variable} antialiased`}
      >
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
