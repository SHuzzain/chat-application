import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import WrapModalProvider from "@/components/provider/wrap-modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Discord',
  description: "Discord",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <html lang="en">
        <body className={cn(inter.className, "bg-main_body_clr")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            storageKey="web-theme"
            enableSystem
            disableTransitionOnChange
          >
            {children}

            <WrapModalProvider />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
