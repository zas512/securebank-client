import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecureBank - Online Banking System",
  description: "A secure online banking system with user authentication, account management, and secure transactions"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="mx-auto flex max-w-[90rem] justify-center">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
