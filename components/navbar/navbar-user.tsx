'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@supabase/auth-js';
import {
  IconChevronDown,
  IconChevronUp,
  IconLogout,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import { Avatar, Group, Menu, Stack, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCurrentUserProfile } from '@/hooks/use-current-user-profile';
import { createClient } from '@/utils/supabase/client';
import classes from './navbar-user.module.css';

export function NavbarUser({ close }: { close: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const userProfile = useCurrentUserProfile();

  const [user, setUser] = useState<User | null>(null);
  const [opened, { toggle, close: closeMenu }] = useDisclosure(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = async () => {
    await supabase.auth.signOut();
    closeMenu();
    close();
    router.push('/');
  };

  if (!user) {
    return (
      <Stack gap="xs">
        <UnstyledButton
          component={Link}
          href={`/auth/login?next=${pathname}`}
          className={classes.authButton}
          onClick={close}
        >
          Sign in
        </UnstyledButton>

        <UnstyledButton
          component={Link}
          href="/auth/sign-up"
          className={classes.authButtonPrimary}
          onClick={close}
        >
          Sign up
        </UnstyledButton>
      </Stack>
    );
  }

  return (
    <Menu opened={opened} onChange={toggle} position="right-end" width={220} shadow="md">
      <Menu.Target>
        <UnstyledButton className={classes.userButton}>
          <Group gap="sm" wrap="nowrap">
            <Avatar radius="xl">{userProfile?.profile?.username?.[0]?.toUpperCase()}</Avatar>

            <Stack gap={0} flex={1}>
              <Text size="sm" fw={500} truncate>
                {userProfile?.profile?.username}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {user.email}
              </Text>
            </Stack>

            {opened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconUser size={16} />}
          component={Link}
          href="/account"
          onClick={() => {
            closeMenu();
            close();
          }}
        >
          Account
        </Menu.Item>

        <Menu.Item
          leftSection={<IconSettings size={16} />}
          component={Link}
          href="/preferences"
          onClick={() => {
            closeMenu();
            close();
          }}
        >
          Preferences
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item leftSection={<IconLogout size={16} />} color="red" onClick={logout}>
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
