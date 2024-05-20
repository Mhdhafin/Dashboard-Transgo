import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";
import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Transgo",
  description: "Manage rent car",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="logo.png" />
        <link rel="shortcut icon" href="logo.png" />
        <meta property="og:title" content="Dashboard Transgo" />
        <meta property="og:description" content="Dashboard Transgo" />
        <meta property="og:url" content="https://dev.dashboard.transgo.id/" />
        <meta
          property="og:image"
          content="https://dev.dashboard.transgo.id/logo.png"
        />
        <meta property="og:site_name" content="Dashboard Transgo" />
        <meta
          name="twitter:card"
          content="summary_large_image"
          key="twitter-card"
        />

        <meta
          name="twitter:image"
          content="https://dev.dashboard.transgo.id/logo.png"
          key="twitter-banner"
        />
      </head>
      <body className={`${inter.className} overflow-hidden`}>
        <Providers session={session}>
          <Toaster />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </Providers>
      </body>
    </html>
  );
}
