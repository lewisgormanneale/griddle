import { Boxes, Home, Puzzle } from "lucide-react";
import { MenuItem } from "@/types/types";

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
];

export default menuItems;
