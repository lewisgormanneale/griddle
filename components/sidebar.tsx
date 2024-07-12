import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Menu, Puzzle } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

type Menu = {
  label: string;
  name: string;
  icon: React.ReactNode;
  href: string;
};

export function Sidebar() {
  const menus: Menu[] = [
    {
      label: "home",
      name: "Home",
      icon: <Home size={15} className="mr-2" />,
      href: "/",
    },
    {
      label: "play",
      name: "Play",
      icon: <Puzzle size={15} className="mr-2" />,
      href: "/nonogram",
    },
  ];

  return (
    <div className="h-screen w-72 flex flex-col p-4 border-r">
      <ScrollArea className="h-full">
        <div className="flex justify-end items-center">
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          {menus.map((menu) => (
            <React.Fragment key={menu.name}>
              <div key={menu.name}>
                <Link
                  href={menu.href}
                  className="flex items-center h-10 bg-white  p-4 text-xs hover:bg-primary dark:hover:bg-primary dark:bg-background dark:hover:text-background hover:text-white rounded-md"
                >
                  <div className="w-6">{menu.icon}</div>
                  {menu.name}
                </Link>
              </div>
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center">
        <ModeToggle />
      </div>
    </div>
  );
}
