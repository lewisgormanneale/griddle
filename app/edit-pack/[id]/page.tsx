import { notFound, redirect } from 'next/navigation';
import { Stack } from '@mantine/core';
import { PageHeader } from '@/components/layout/page-header';
import { EditPackClient } from './edit-pack-client';
import { getPackById } from '@/utils/supabase/server-queries';
import { createClient } from '@/utils/supabase/server';

export default async function EditPackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const packId = Number(id);
  if (Number.isNaN(packId)) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  const pack = await getPackById(packId);
  if (!pack || pack.user_id !== user.id) {
    notFound();
  }

  return (
    <Stack gap="md">
      <PageHeader title="Edit pack" align="left" />
      <EditPackClient pack={pack} profileUsername={pack.profiles?.username} />
    </Stack>
  );
}
