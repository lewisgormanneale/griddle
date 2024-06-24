import Link from "next/link";
import { ThemeToggle } from "./themeToggle";
import { LuHome } from "react-icons/lu";

export function Header() {
  return (
    <header className="flex justify-between p-3">
      <Link className="font-serif" href="/">
        <LuHome className="w-6 h-6" />
      </Link>
      <ThemeToggle />
    </header>
  );
}
