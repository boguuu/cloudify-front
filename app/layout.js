import localFont from "next/font/local";
import "./globals.css";
import React from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Cloudify",
  description: "대화형 음악 추천 서비스",
  images: [{ url: "/og-image.png" }],
  type: "website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <>{children}</>
      </body>
    </html>
  );
}
