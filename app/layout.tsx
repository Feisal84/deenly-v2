import "./globals.css";
import { ReactNode } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Deenly - Moschee Khutba App",
  description: "Erhalten Sie aktuelle Informationen zu Khutbas und Aktivitäten in Moscheen in Ihrer Nähe",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
