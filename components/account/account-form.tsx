'use client';

import { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type User } from '@supabase/supabase-js';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Card, Group, Stack, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Avatar from '@/components/account/avatar';
import { createClient } from '@/utils/supabase/client';

const accountFormSchema = z.object({
  email: z.string().email(),
  username: z.string().optional(),
  avatar_url: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function AccountForm({ user }: { user: User }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: user.email ?? '',
      username: '',
      avatar_url: '',
    },
  });

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setValue('username', data.username ?? '');
        setValue('avatar_url', data.avatar_url ?? '');
      }
    } catch {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Failed to load profile data',
      });
    } finally {
      setLoading(false);
    }
  }, [supabase, user.id, setValue]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const onSubmit = async (values: AccountFormValues) => {
    try {
      setLoading(true);

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username: values.username,
        avatar_url: values.avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      notifications.show({
        color: 'green',
        title: 'Profile updated',
        message: 'Changes may take a moment to appear',
      });
    } catch {
      notifications.show({
        color: 'red',
        title: 'Update failed',
        message: 'There was a problem updating your profile',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card withBorder radius="md" p="lg" maw={480} mx="auto">
      <Stack gap="md">
        <div>
          <Text fw={600} size="lg">
            Account
          </Text>
          <Text size="sm" c="dimmed">
            Make changes to your account information
          </Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="sm">
            <TextInput label="Email" disabled {...register('email')} />

            <TextInput
              label="Username"
              {...register('username')}
              error={errors.username?.message}
              description="This name will appear publicly"
            />

            <div>
              <Text size="sm" fw={500} mb={4}>
                Avatar
              </Text>

              <Avatar
                uid={user.id}
                url={watch('avatar_url') ?? ''}
                size={150}
                onUpload={(url) => setValue('avatar_url', url)}
              />

              <Text size="xs" c="dimmed" mt={4}>
                This image will appear alongside your username
              </Text>
            </div>

            <Group justify="flex-end" mt="md">
              <Button type="submit" loading={loading}>
                Update profile
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
}
