// @ts-ignore: side-effect import of CSS without type declarations
import "@/css/satoshi.css";
// @ts-ignore: side-effect import of CSS without type declarations
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";
// @ts-ignore: side-effect import of CSS without type declarations
import "flatpickr/dist/flatpickr.min.css";
// @ts-ignore: side-effect import of CSS without type declarations
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin - Dashboard Kit",
    default: "Admin - Dashboard Kit",
  },
  description:
    "Admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />

          <div className="flex min-h-screen">
            <Sidebar />

            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              <Header />

              <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
