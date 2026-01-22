import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. 引入 GoogleAnalytics 组件
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sam Chow Portfolio",
  description: "Multimedia Designer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
      {/* 2. Google Analytics 設定 - 已填入你的 ID */}
      <GoogleAnalytics gaId="G-KH8NZMDX59" />
    </html>
  );
}