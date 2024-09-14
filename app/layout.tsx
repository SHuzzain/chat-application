import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/provider/theme-provider";
import WrapModalProvider from "@/components/provider/wrap-modal-provider";
import { SocketProvider } from "@/components/provider/socket-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord",
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
            <SocketProvider>{children}</SocketProvider>

            <WrapModalProvider />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
