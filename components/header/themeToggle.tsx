"use client";

import { LuSun, LuMoon } from "react-icons/lu";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-6 h-6"></div>;
  if (resolvedTheme === "dark") {
    return <LuSun className="w-6 h-6" onClick={() => setTheme("light")} />;
  }

  if (resolvedTheme === "light") {
    return <LuMoon className="w-6 h-6" onClick={() => setTheme("dark")} />;
  }
}
