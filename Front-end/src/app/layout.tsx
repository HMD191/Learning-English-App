import "../styles/globals.css";
import type { Metadata } from "next";
import MainLayout from "@/components/MainLayout"; // đây là Client Component chứa useState

export const metadata: Metadata = {
  title: "Learning English App",
  description: "A great English learning platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}