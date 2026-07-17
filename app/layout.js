import "./globals.css";
import { Noto_Serif_SC, Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif-sc",
  display: "swap",
});

export const metadata = {
  title: "Our Love Story | 我们的爱情故事",
  description: "记录属于我们的每一个瞬间，从相遇到相守，从此刻到永远",
  keywords: "couple, love story, 情侣, 爱情故事",
  authors: [{ name: "Us" }],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport = {
  themeColor: "#FFFBF5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className={`${playfair.variable} ${notoSerifSC.variable}`}>
        {children}
      </body>
    </html>
  );
}
