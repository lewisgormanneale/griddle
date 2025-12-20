"use client";

import { useState } from "react";
import {
  IconHomeFilled,
  IconLibraryFilled,
  IconLogout,
  IconPuzzleFilled,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import { Code, Group } from "@mantine/core";
import classes from "./navbar.module.css";

const navbarItems = [
  { link: "/", label: "Home", icon: IconHomeFilled },
  { link: "/nonogram/4", label: "Today's Puzzle", icon: IconPuzzleFilled },
  { link: "/packs", label: "Packs", icon: IconLibraryFilled },
];

export function Navbar() {
  const [active, setActive] = useState("Home");

  const links = navbarItems.map((navbarItem) => (
    <a
      className={classes.link}
      data-active={navbarItem.label === active || undefined}
      href={navbarItem.link}
      key={navbarItem.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(navbarItem.label);
      }}
    >
      <navbarItem.icon className={classes.linkIcon} stroke={1.5} />
      <span>{navbarItem.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <p>Griddle</p>
          <Code fw={700}>v3.1.2</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
