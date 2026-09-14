'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Stack, Textarea, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { Tables } from '@/types/database.types';
import { updatePack } from '@/utils/supabase/queries';

type EditPackClientProps = {
  pack: Tables<'packs'>;
  profileUsername?: string | null;
};

export function EditPackClient({ pack, profileUsername }: EditPackClientProps) {
  const router = useRouter();
  const [name, setName] = useState<string>(pack.name ?? '');
  const [description, setDescription] = useState<string>(pack.description ?? '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const updated = await updatePack({ id: pack.id, name, description });
    setSubmitting(false);

    if (updated) {
      notifications.show({
        title: 'Pack updated',
        message: 'Your changes have been saved.',
        color: 'green',
      });
      const fallback = `/profile/${pack.user_id}`;
      router.push(profileUsername ? `/profile/${profileUsername}` : fallback);
    } else {
      notifications.show({
        title: 'Update failed',
        message: 'Could not save the pack. Please try again.',
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card withBorder radius="md" padding="md" data-testid="edit-pack-form">
        <Stack gap="sm">
          <TextInput
            label="Title"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            required
            data-testid="edit-pack-title"
          />
          <Textarea
            label="Description"
            value={description}
            autosize
            minRows={3}
            onChange={(event) => setDescription(event.currentTarget.value)}
            data-testid="edit-pack-description"
          />
          <Button type="submit" loading={submitting} data-testid="edit-pack-submit">
            Save changes
          </Button>
        </Stack>
      </Card>
    </form>
  );
}
