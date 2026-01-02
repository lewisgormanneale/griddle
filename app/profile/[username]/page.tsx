import { notFound } from 'next/navigation';
import { Avatar, Card, Group, Stack, Text, Title } from '@mantine/core';
import Pack from '@/components/packs/pack';
import { PageHeader } from '@/components/layout/page-header';
import {
  getPacksForUserServer,
  getProfileByUsername,
  getUserStats,
} from '@/utils/supabase/server-queries';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const [packs, stats] = await Promise.all([
    getPacksForUserServer(profile.id),
    getUserStats(profile.id),
  ]);

  return (
    <Stack gap="md">
      <PageHeader title={profile.username ?? 'Profile'} align="left" />

      <Group align="center" gap="md">
        <Avatar size={64} radius="xl" src={profile.avatar_url ?? undefined} alt={`${username} avatar`} />
        <Stack gap={0}>
          <Title order={3}>{profile.username ?? 'Unknown user'}</Title>
          <Text c="dimmed" size="sm">
            @{username}
          </Text>
        </Stack>
      </Group>

      <Card withBorder radius="md">
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
        <Title order={4}>Packs by {profile.username}</Title>
        {packs.length > 0 ? (
          packs.map((pack) => <Pack key={pack.id} pack={pack} />)
        ) : (
          <Text c="dimmed" size="sm">
            No packs published yet.
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
