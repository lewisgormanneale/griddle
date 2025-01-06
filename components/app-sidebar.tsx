import {BarChart3, Boxes, CircleHelp, Home, PencilRuler, Puzzle} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import React from "react";
import {MenuItem} from "@/types/types";
import Link from "next/link";

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
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <span className={"font-zen-dots text-xl"}>GRIDDLE</span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton asChild>
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

            <SidebarRail/>
        </Sidebar>
    )
}
