import type { Metadata } from "next";
import LinkGenerator from "./LinkGenerator";

export const metadata: Metadata = {
  title: "Invitation Links",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <LinkGenerator />;
}
