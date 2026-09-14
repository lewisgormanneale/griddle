import { redirect } from 'next/navigation';
import { Avatar, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { PageHeader } from '@/components/layout/page-header';
import Pack from '@/components/packs/pack';
import { createClient } from '@/utils/supabase/server';
import {
  getPacksForUserServer,
  getProfileByUsername,
  getUserStats,
} from '@/utils/supabase/server-queries';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    redirect('/?notice=profile-missing');
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [packs, stats] = await Promise.all([
    getPacksForUserServer(profile.id),
    getUserStats(profile.id),
  ]);
  const isOwnProfile = user?.id === profile.id;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <PageHeader
          title={isOwnProfile ? 'My Profile' : (profile.username ?? 'Profile')}
          align="left"
        />
        {isOwnProfile && (
          <Button
            component="a"
            href="/account-settings"
            variant="subtle"
            size="sm"
            maw={180}
            data-testid="account-settings-link"
          >
            Edit Profile Details
          </Button>
        )}
      </Group>

      <Group align="center" gap="md">
        <Avatar
          size={64}
          radius="xl"
          src={profile.avatar_url ?? undefined}
          alt={`${username} avatar`}
        />
        <Stack gap={0}>
          <Title order={3}>{profile.username ?? 'Unknown user'}</Title>
          <Text c="dimmed" size="sm">
            @{username}
          </Text>
        </Stack>
      </Group>

      <Card withBorder radius="md" padding="md">
        <Group justify="space-around">
          <Stack gap={4} align="center">
            <Title order={3}>{stats.totalSolved}</Title>
            <Text size="sm" c="dimmed">
              Puzzles solved
            </Text>
          </Stack>
          <Stack gap={4} align="center">
            <Title order={3}>{stats.completedPacks}</Title>
            <Text size="sm" c="dimmed">
              Packs completed
            </Text>
          </Stack>
        </Group>
      </Card>

      <Stack gap="sm">
        <Title order={4}>{isOwnProfile ? 'My Packs' : `Packs by ${profile.username}`}</Title>
        {packs.length > 0 ? (
          packs.map((pack) => (
            <Pack key={pack.id} pack={pack} editable={isOwnProfile} showOwner={!isOwnProfile} />
          ))
        ) : (
          <Text c="dimmed" size="sm">
            No packs published yet.
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
