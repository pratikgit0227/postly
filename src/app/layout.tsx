import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Postly - Social Media Scheduling",
  description: "Write, schedule, and publish to all your social media platforms in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
