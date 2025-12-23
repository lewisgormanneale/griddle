'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, Center, Loader, SimpleGrid, Text, Title } from '@mantine/core';
import { Tables } from '@/types/database.types';
import { getNonogramsForPack } from '@/utils/supabase/queries';
import NonogramGridPreview from './nonogram-grid-preview';
import classes from './pack.module.css';

const Pack = ({ pack }: { pack: Tables<'packs'> }) => {
  const [nonograms, setNonograms] = useState<Tables<'nonograms'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getNonogramsForPack(pack.id)
      .then((data) => setNonograms(data))
      .finally(() => setLoading(false));
  }, [pack.id]);

  return (
    <Card withBorder radius="md">
      <Card.Section withBorder className={classes.header}>
        <Title order={3}>{pack.name}</Title>
      </Card.Section>

      {pack.description && (
        <Card.Section className={classes.description}>
          <Text size="sm" color="dimmed">
            {pack.description}
          </Text>
        </Card.Section>
      )}

      <Card.Section className={classes.content}>
        {loading ? (
          <Center py="md">
            <Loader size="sm" />
          </Center>
        ) : nonograms.length > 0 ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {nonograms.map((nonogram) => (
              <Card key={nonogram.id} withBorder radius="md" className={classes.nonogramCard}>
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
          <Text size="sm" color="dimmed" ta="center">
            No puzzles in this pack yet.
          </Text>
        )}
      </Card.Section>
    </Card>
  );
};

export default Pack;
