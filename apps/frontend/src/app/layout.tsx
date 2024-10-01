import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/app/lib/utils";
import { ThemeProvider } from "@/app/providers/theme";
import { LocalStorageProvider } from "@/app/providers/LocalStorage";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LocalStorageProvider>{children}</LocalStorageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
