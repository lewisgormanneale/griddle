"use client";

import { BarChart3, Boxes, CircleHelp, Home, Puzzle } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import React from "react";
import { MenuItem } from "@/types/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";

const items: MenuItem[] = [
  {
    label: "home",
    name: "Home",
    icon: <Home size={15} />,
    url: "/",
  },
  {
    label: "nonogram",
    name: "Today's Puzzle",
    icon: <Puzzle size={15} />,
    url: "/daily",
  },
  {
    label: "packs",
    name: "Packs",
    icon: <Boxes size={15} />,
    url: "/packs",
  },
  {
    label: "statistics",
    name: "Statistics",
    icon: <BarChart3 size={15} />,
    url: "/statistics",
  },
  {
    label: "help",
    name: "Help",
    icon: <CircleHelp size={15} />,
    url: "/help",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={"font-zen-dots uppercase"}>
            Griddle
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
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
        <ModeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
