import SideNav from "@/components/layout/SideNav";
import TopNav from "@/components/layout/TopNav";
import MobileNav from "@/components/layout/MobileNav";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>

      <body className="bg-background text-on-background min-h-screen flex overflow-hidden">
        <SideNav />

        <div className="flex-grow flex flex-col h-screen overflow-hidden">
          <TopNav />

          <main className="flex-grow overflow-y-auto p-gutter lg:p-margin-desktop pb-24 md:pb-gutter">
            {children}
          </main>
        </div>

        <MobileNav />
      </body>
    </html>
  );
}