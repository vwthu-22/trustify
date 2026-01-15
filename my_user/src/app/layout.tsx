import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
// @ts-ignore: side-effect import of CSS without type declarations
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const t = await getTranslations('common');
  const locale = await getLocale();

  return {
    title: {
      default: t('metadata.title'),
      template: `%s | ${t('metadata.title')}`
    },
    description: t('metadata.description'),
    keywords: t('metadata.keywords'),
    authors: [{ name: "Trustify Team" }],
    creator: "Trustify",
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      type: "website",
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      url: "https://trustify-pied.vercel.app",
      siteName: "Trustify",
      title: t('metadata.ogTitle'),
      description: t('metadata.ogDescription'),
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 600,
          alt: "Trustify Logo",
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: "U9VqYJ5clswKeXaBfNYeLiU2edxn-Vxjeu8tJl4Vnyo",
    },
  };
}

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
