import Link from "next/link";
import { Home } from "lucide-react";
import { ModeToggle } from "../mode-toggle";

export function Header() {
  return (
    <header className="flex justify-between p-3">
      <Link className="font-serif" href="/">
        <Home />
      </Link>
      <ModeToggle />
    </header>
  );
}
