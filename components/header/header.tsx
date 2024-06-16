import { ThemeToggle } from "./themeToggle";

export function Header() {
  return (
    <header className="flex justify-between p-3">
      <h1>Nonogrammable</h1>
      <ThemeToggle />
    </header>
  );
}
