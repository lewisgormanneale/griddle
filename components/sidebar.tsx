"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  Boxes,
  Home,
  Menu, PencilRuler,
  Puzzle
} from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { useState } from "react";

type Menu = {
  label: string;
  name: string;
  icon: React.ReactNode;
  href: string;
};

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const menus: Menu[] = [
    {
      label: "home",
      name: "Home",
      icon: <Home size={15} />,
      href: "/",
    },
    {
      label: "play",
      name: "Play",
      icon: <Puzzle size={15} />,
      href: "/play",
    },
    {
      label: "nonograms",
      name: "Creations & Packs",
      icon: <Boxes size={15} />,
      href: "/nonograms",
    },
    {
      label: "creator",
      name: "Creator",
      icon: <PencilRuler size={15} />,
      href: "/creator",
    },
    {
      label: "statistics",
      name: "Statistics",
      icon: <BarChart3 size={15} />,
      href: "/statistics",
    }
  ];

  return (
    <div
      className={`h-screen ${
        isExpanded ? "w-screen sm:w-64" : "w-18"
      } flex flex-col p-2 border-r transition-all bg-card flex-shrink-0 flex-grow-0`}
    >
      <ScrollArea className="h-full">
        <div className="flex justify-between items-center m-1">
          {isExpanded ? <span className={"font-zen-dots text-3xl"}>GRIDDLE</span> : ""}
          <Button onClick={toggleSidebar} variant="ghost" size="icon">
            <Menu />
          </Button>
        </div>
        <div className={`flex flex-col gap-2 mt-2`}>
          {menus.map((menu) => (
              <React.Fragment key={menu.name}>
              <Link
                href={menu.href}
                className="flex items-center bg-white p-3 m-1 text-xs hover:bg-primary dark:hover:bg-primary dark:bg-background dark:hover:text-background hover:text-white rounded-md"
              >
                <div>{menu.icon}</div>
                <span
                  className={`${isExpanded ? "ml-2 leading-none" : "hidden"}`}
                >
                  {menu.name}
                </span>
              </Link>
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center justify-end">
        <ModeToggle />
      </div>
    </div>
  );
}
