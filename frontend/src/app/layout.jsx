import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  description: "Được tạo bởi create next app",
  title: "Tạo ứng dụng Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      lang="vi"
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
