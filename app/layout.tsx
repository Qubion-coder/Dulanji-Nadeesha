import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Cormorant_Infant, Pinyon_Script } from "next/font/google";
import { coupleNames, ogImage, wedding } from "@/lib/wedding";
import "./globals.css";

const body = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-body" });
const head = Cormorant_Infant({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-head" });
const script = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-script" });

export const metadata: Metadata = {
  ...(wedding.baseUrl ? { metadataBase: new URL(wedding.baseUrl) } : {}),
  title: coupleNames,
  description: `${coupleNames} · ${wedding.eventName} · ${wedding.dateLong}`,
  openGraph: {
    title: `${coupleNames} · ${wedding.eventName}`,
    description: `${wedding.dateLong} · ${wedding.venue.name}, ${wedding.venue.area}`,
    type: "website",
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", images: [ogImage.url] },
};

export const viewport: Viewport = {
  themeColor: "#F2EFE6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${head.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
