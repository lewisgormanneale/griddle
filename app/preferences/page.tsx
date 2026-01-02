import { Stack, Text } from '@mantine/core';
import { PageHeader } from '@/components/layout/page-header';

export default function PreferencesPage() {
  return (
    <Stack gap="sm" data-testid="preferences-page">
      <PageHeader
        title="Preferences"
        description="Tune your Griddle experience."
        align="left"
        testId="preferences-header"
      />
      <Text c="dimmed" data-testid="preferences-placeholder">
        Preferences are coming soon.
      </Text>
    </Stack>
  );
}
