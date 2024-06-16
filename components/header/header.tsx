import Link from "next/link";
import { ThemeToggle } from "./themeToggle";

export function Header() {
  return (
    <header className="flex justify-between p-3">
      <Link href="/">Nonogrammable</Link>
      <ThemeToggle />
    </header>
  );
}
