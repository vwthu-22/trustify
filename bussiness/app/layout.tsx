import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
// @ts-ignore: side-effect import of CSS without type declarations
import "./globals.css";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Company Dashboard",
  description: "Trustify Company Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto bg-gray-50">
                <div className="p-8">{children}</div>
              </main>
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
