'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHomeFilled, IconLibraryFilled, IconPuzzleFilled } from '@tabler/icons-react';
import { NavbarUser } from './navbar-user';
import classes from './navbar.module.css';

const navbarItems = [
  { link: '/', label: 'Home', icon: IconHomeFilled },
  { link: '/nonogram/4', label: "Today's Puzzle", icon: IconPuzzleFilled },
  { link: '/packs', label: 'Packs', icon: IconLibraryFilled },
];

export function Navbar({ close }: { close: () => void }) {
  const pathname = usePathname();

  const links = navbarItems.map((navbarItem) => (
    <Link
      className={classes.link}
      data-active={pathname === navbarItem.link || undefined}
      href={navbarItem.link}
      key={navbarItem.label}
      onClick={() => close()}
    >
      <navbarItem.icon className={classes.linkIcon} stroke={1.5} />
      <span>{navbarItem.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>
      <div className={classes.navbarFooter}>
        <NavbarUser close={close} />
      </div>
    </nav>
  );
}
