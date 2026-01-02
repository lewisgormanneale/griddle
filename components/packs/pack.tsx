'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { Badge, Button, Card, Center, Group, Loader, SimpleGrid, Text, Title } from '@mantine/core';
import { useAsyncData } from '@/hooks/use-async-data';
import {
  getNonogramsForPack,
  NonogramWithProfile,
  PackWithProfile,
} from '@/utils/supabase/queries';
import NonogramGridPreview from './nonogram-grid-preview';
import classes from './pack.module.css';

const Pack = ({ pack }: { pack: PackWithProfile }) => {
  const ownerName = pack.profiles?.username;
  const loadNonograms = useCallback(() => getNonogramsForPack(pack.id), [pack.id]);
  const { data: nonograms = [], loading } = useAsyncData<NonogramWithProfile[]>(
    loadNonograms,
    [loadNonograms],
    { initialData: [] }
  );

  return (
    <Card withBorder radius="md" data-testid="pack-card">
      <Card.Section withBorder className={classes.header} data-testid="pack-header">
        <Group justify="space-between" align="center" gap="sm">
          <Title order={3}>{pack.name}</Title>
          {ownerName && <Badge variant="light">by {ownerName}</Badge>}
        </Group>
      </Card.Section>

      {pack.description && (
        <Card.Section className={classes.description} data-testid="pack-description">
          <Text size="sm" color="dimmed">
            {pack.description}
          </Text>
        </Card.Section>
      )}

      <Card.Section className={classes.content} data-testid="pack-content">
        {loading ? (
          <Center py="md" data-testid="pack-loading">
            <Loader size="sm" />
          </Center>
        ) : nonograms.length > 0 ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {nonograms.map((nonogram) => (
              <Card
                key={nonogram.id}
                withBorder
                radius="md"
                className={classes.nonogramCard}
                data-testid="pack-nonogram-card"
              >
                <div className={classes.nonogramHeader}>
                  <Text fw={500}>{nonogram.title}</Text>
                  <Text size="xs" color="dimmed">
                    {nonogram.height} × {nonogram.width}
                  </Text>
                </div>

                <div className={classes.preview}>
                  <NonogramGridPreview rows={nonogram.height} columns={nonogram.width} />
                </div>

                <Button
                  component={Link}
                  href={`/nonogram/${nonogram.id}`}
                  variant="light"
                  fullWidth
                  mt="sm"
                >
                  Play
                </Button>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Text size="sm" color="dimmed" ta="center" data-testid="pack-empty">
            No puzzles in this pack yet.
          </Text>
        )}
      </Card.Section>
    </Card>
  );
};

export default Pack;
