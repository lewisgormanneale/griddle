'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AppShell, Box, Burger, Flex, Group, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import classes from '@/app/layout.module.css';
import { ColorSchemeToggle } from '@/components/color-scheme-toggle';
import { Navbar } from '@/components/navbar/navbar';

function NoticeListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [noticeShown, setNoticeShown] = useState<string | null>(null);

  useEffect(() => {
    const notice = searchParams.get('notice');
    if (!notice || notice === noticeShown) {
      return;
    }

    const message =
      notice === 'nonogram-missing'
        ? 'That nonogram could not be found.'
        : notice === 'profile-missing'
          ? 'That profile could not be found.'
          : 'Sorry, we could not find what you were looking for.';

    notifications.show({ color: 'red', message });
    setNoticeShown(notice);
    router.replace(pathname);
  }, [noticeShown, pathname, router, searchParams]);

  return null;
}

export function AppShellLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Flex justify="space-between" align="center" h="100%">
          <Group align="center" h="100%" px="sm" gap="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="xl" lh={0} tt="uppercase" className="font-zen-dots" component={Link} href="/">
              Griddle
            </Text>
          </Group>
          <Group align="center" h="100%" px="sm" gap="sm">
            <ColorSchemeToggle />
          </Group>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar close={close} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Box p="md" className={classes.page}>
          <Suspense fallback={null}>
            <NoticeListener />
          </Suspense>
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
