import { BarChart3, Boxes, CircleHelp, Home, Puzzle } from "lucide-react";
import { MenuItem } from "@/types/types";
import React from "react";

const menuItems: MenuItem[] = [
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
    url: "/nonogram/4",
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

export default menuItems;
