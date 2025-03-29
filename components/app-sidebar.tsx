'use client';

import {BarChart3, Boxes, CircleHelp, Home, PencilRuler, Puzzle} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import React from "react";
import {MenuItem} from "@/types/types";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ModeToggle} from "@/components/mode-toggle";

// Menu items.
const items: MenuItem[] = [
    {
        label: "home",
        name: "Home",
        icon: <Home size={15}/>,
        url: "/",
    },
    {
        label: "play",
        name: "Play",
        icon: <Puzzle size={15}/>,
        url: "/play",
    },
    {
        label: "nonograms",
        name: "Packs & Creations",
        icon: <Boxes size={15}/>,
        url: "/nonograms",
    },
    {
        label: "creator",
        name: "Creator",
        icon: <PencilRuler size={15}/>,
        url: "/creator",
    },
    {
        label: "statistics",
        name: "Statistics",
        icon: <BarChart3 size={15}/>,
        url: "/statistics",
    },
    {
        label: "help",
        name: "Help",
        icon: <CircleHelp size={15}/>,
        url: "/help",
    }
]

export function AppSidebar() {
    const pathname = usePathname();
    const {state, isMobile} = useSidebar();
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-3">
                    <SidebarMenuButton asChild>
                        <Home></Home>
                    </SidebarMenuButton>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                    >
                                        <Link href={item.url}>
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <ModeToggle/>
            </SidebarFooter>

            <SidebarRail/>
        </Sidebar>
    )
}
