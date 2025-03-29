'use client';

import {SidebarInset, SidebarTrigger,} from "@/components/ui/sidebar"
import React from "react";
import {usePathname} from "next/navigation";


export function AppSidebarInset({
                                    children,
                                }: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 fixed">
                <div className="flex items-center gap-2 px-3">
                    <SidebarTrigger/>
                </div>
            </header>
            <main className="pt-16 px-12">
                {children}
            </main>
        </SidebarInset>
    )
}
