import "./globals.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Our Love Story | 我们的爱情故事",
  description: "记录属于我们的每一个瞬间，从相遇到相守，从此刻到永远",
  keywords: "couple, love story, 情侣, 爱情故事",
  authors: [{ name: "Us" }],
};

export const viewport = {
  themeColor: "#FFFBF7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={`${inter.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
