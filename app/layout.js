import "./globals.css";
import { Noto_Serif_SC, Playfair_Display } from "next/font/google";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site-metadata.mjs";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}｜我们的爱情故事`,
    template: `%s｜${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "杜明洋",
    "陈柯嘉",
    "情侣纪念",
    "爱情故事",
    "浪漫相册",
    "纪念日",
  ],
  authors: [{ name: "杜明洋" }, { name: "陈柯嘉" }],
  creator: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME}｜我们的爱情故事`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME}的爱情纪念网站`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME}｜我们的爱情故事`,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image.png"],
  },
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
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={`${playfair.variable} ${notoSerifSC.variable}`}>
        {children}
      </body>
    </html>
  );
}
