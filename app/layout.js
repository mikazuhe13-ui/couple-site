import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Noto+Serif+SC:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, overflowX: "hidden" }}>{children}</body>
    </html>
  );
}
