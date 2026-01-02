'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconChevronDown,
  IconChevronUp,
  IconLogout,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import { Avatar, Group, Menu, Skeleton, Stack, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useAuthUser } from '@/hooks/use-auth-user';
import { useCurrentUserImage } from '@/hooks/use-current-user-image';
import { useCurrentUserProfile } from '@/hooks/use-current-user-profile';
import { createClient } from '@/utils/supabase/client';
import classes from './navbar-user.module.css';

export function NavbarUser({ close }: { close: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { user, loading: authLoading } = useAuthUser();
  const [opened, { toggle, close: closeMenu }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 48em)');
  const userProfile = useCurrentUserProfile(user?.id);
  const profileImage = useCurrentUserImage(user?.id);
  const displayName = userProfile?.profile?.username ?? user?.email ?? '';
  const userInitial = displayName?.[0]?.toUpperCase();

  const logout = async () => {
    await supabase.auth.signOut();
    closeMenu();
    close();
    router.push('/');
  };

  if (authLoading) {
    return (
      <Stack gap="xs">
        <Skeleton height={36} radius="md" />
        <Skeleton height={36} radius="md" />
      </Stack>
    );
  }

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
    <Menu
      opened={opened}
      onChange={toggle}
      position={isMobile ? 'bottom' : 'right-end'}
      width={isMobile ? 'target' : 220}
      shadow="md"
    >
      <Menu.Target>
        <UnstyledButton className={classes.userButton}>
          <Group gap="sm" wrap="nowrap" style={{ maxWidth: '100%' }}>
            {userProfile.loading ? (
              <Skeleton height={34} width={34} radius="xl" />
            ) : (
              <Avatar radius="xl" src={profileImage} alt="profile picture">
                {userInitial}
              </Avatar>
            )}

            <Stack gap={0} flex={1} style={{ minWidth: 0 }}>
              <Text size="sm" fw={500} truncate>
                {displayName}
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
        <Menu.Label>
          <Group gap="sm" wrap="nowrap" style={{ maxWidth: '100%' }}>
            {userProfile.loading ? (
              <Skeleton height={28} width={28} radius="xl" />
            ) : (
              <Avatar size="sm" radius="xl" src={profileImage} alt="profile picture">
                {userInitial}
              </Avatar>
            )}
            <Stack gap={0} style={{ minWidth: 0 }}>
              <Text size="sm" fw={500} truncate>
                {displayName}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {user.email}
              </Text>
            </Stack>
          </Group>
        </Menu.Label>

        <Menu.Divider />

        {userProfile.profile?.username && (
          <Menu.Item
            leftSection={<IconUser size={16} />}
            component={Link}
            href={`/profile/${userProfile.profile.username}`}
            onClick={() => {
              closeMenu();
              close();
            }}
          >
            Profile
          </Menu.Item>
        )}

        <Menu.Item
          leftSection={<IconUser size={16} />}
          component={Link}
          href="/account-settings"
          onClick={() => {
            closeMenu();
            close();
          }}
        >
          Account Settings
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
