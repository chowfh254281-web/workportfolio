import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. 引入 Inter 字體
import "./globals.css";

// 2. 設定 Inter 字體參數
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sam Chow | Portfolio",
  description: "Photography Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. 將 Inter 字體應用到 body，這樣全個網站都會變 Inter */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}