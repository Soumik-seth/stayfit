import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StayFit | Personalized Diet & Lifestyle Plans",
  description:
    "StayFit helps you build healthier habits with personalized diet plans, lifestyle guidance, progress tracking and expert support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}