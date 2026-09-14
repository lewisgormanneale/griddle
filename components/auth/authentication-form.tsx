'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconInfoCircle } from '@tabler/icons-react';
import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { createClient } from '@/utils/supabase/client';
import { GitHubButton } from './github-button';

export function AuthenticationForm(props: PaperProps) {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') === 'register' ? 'register' : 'login';
  const [type, toggle] = useToggle(
    initialType === 'register' ? ['register', 'login'] : ['login', 'register']
  );
  const [isLoading, setIsLoading] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      if (type === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: form.values.email,
          password: form.values.password,
          options: {
            data: form.values.name ? { username: form.values.name } : undefined,
          },
        });
        if (error) {
          throw error;
        }
        if (data.session) {
          router.push('/account-settings');
        } else {
          // Email confirmation is required before a session exists.
          setAwaitingConfirmation(true);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.values.email,
          password: form.values.password,
        });
        if (error) {
          throw error;
        }
        router.push('/account-settings');
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper radius="md" p="lg" withBorder {...props}>
      <Text size="lg" fw={500}>
        Welcome to Mantine, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GitHubButton radius="xl">GitHub</GitHubButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      {awaitingConfirmation ? (
        <Stack>
          <Alert icon={<IconInfoCircle size={16} />} title="Check your email" color="blue">
            We sent a confirmation link to {form.values.email}. Follow it to finish creating your
            account.
          </Alert>
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            size="xs"
            onClick={() => {
              setAwaitingConfirmation(false);
              toggle();
            }}
          >
            Back to login
          </Anchor>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack>
            {error && (
              <Text size="sm" c="red">
                {error}
              </Text>
            )}
            {type === 'register' && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
              radius="md"
            />

            {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => {
                setError(null);
                toggle();
              }}
              size="xs"
            >
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl" loading={isLoading}>
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      )}
    </Paper>
  );
}
