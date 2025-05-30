import type { Metadata } from "next";
import "@/styles/globals.css";
import { Inter, Unna, Zen_Dots } from "next/font/google";
import { cn } from "@/utils/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { cookies } from "next/headers";
import { AppSidebarInset } from "@/components/app-sidebar/app-sidebar-inset";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const zenDots = Zen_Dots({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-zen-dots",
});

const unna = Unna({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-unna",
});

export const metadata: Metadata = {
  title: "Griddle",
  description: "Solve and generate nonogram puzzles online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-serif antialiased",
          inter.variable,
          zenDots.variable,
          unna.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <AppSidebarInset>{children}</AppSidebarInset>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
