"use client";

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export function AppSidebarInset({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarInset>
      <header className="flex h-12 shrink-0 items-center gap-2 fixed mx-2">
        <SidebarTrigger />
        {/*<ResponsiveBreadcrumbs />*/}
      </header>
      <main className="mt-12">{children}</main>
    </SidebarInset>
  );
}
