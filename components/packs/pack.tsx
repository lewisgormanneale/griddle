'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { EmblaCarouselType } from 'embla-carousel';
import { Carousel, CarouselSlide } from '@mantine/carousel';
import {
  Badge,
  Button,
  Card,
  CardSection,
  Center,
  Group,
  Loader,
  Text,
  Title,
} from '@mantine/core';
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
  const pages = useMemo(() => {
    const chunkSize = 3;
    const result: NonogramWithProfile[][] = [];
    for (let i = 0; i < nonograms.length; i += chunkSize) {
      result.push(nonograms.slice(i, i + chunkSize));
    }
    return result;
  }, [nonograms]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);

  useEffect(() => {
    if (activeSlide >= pages.length) {
      setActiveSlide(0);
      embla?.scrollTo(0);
    }
  }, [activeSlide, embla, pages.length]);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
    embla?.scrollTo(index);
  };

  return (
    <Card withBorder radius="md" p="sm" data-testid="pack-card">
      <CardSection withBorder pt="md" px="md" pb="xs" data-testid="pack-header">
        <Group justify="space-between" align="center" gap="sm">
          <Title order={4} m={0}>
            {pack.name}
          </Title>
          {ownerName && (
            <Badge variant="light" size="sm">
              by {ownerName}
            </Badge>
          )}
        </Group>
      </CardSection>

      {pack.description && (
        <CardSection px="sm" py="xs" data-testid="pack-description">
          <Text size="xs" color="dimmed">
            {pack.description}
          </Text>
        </CardSection>
      )}

      <CardSection px="sm" pb="xs" data-testid="pack-content">
        {loading ? (
          <Center py="lg" data-testid="pack-loading">
            <Loader size="sm" />
          </Center>
        ) : pages.length > 0 ? (
          <>
            <Carousel
              withIndicators
              slideSize="100%"
              onSlideChange={setActiveSlide}
              getEmblaApi={setEmbla}
              controlsOffset="xs"
              data-testid="pack-carousel"
            >
              {pages.map((page, pageIndex) => (
                <CarouselSlide key={`page-${pageIndex}`}>
                  <Group grow align="stretch" gap="sm">
                    {page.map((nonogram) => (
                      <Card
                        key={nonogram.id}
                        withBorder
                        radius="md"
                        p="sm"
                        className={classes.nonogramCard}
                        data-testid="pack-nonogram-card"
                      >
                        <div>
                          <Text fw={600} size="sm">
                            {nonogram.title}
                          </Text>
                          <Text size="xs" color="dimmed" fw={500}>
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
                          size="xs"
                          fullWidth
                          mt="xs"
                        >
                          Play
                        </Button>
                      </Card>
                    ))}
                  </Group>
                </CarouselSlide>
              ))}
            </Carousel>
            <Group justify="center" gap="xs" my="xs" data-testid="pack-pagination">
              {pages.map((_page, index) => (
                <Button
                  key={`page-${index}`}
                  size="compact-xs"
                  variant={index === activeSlide ? 'filled' : 'light'}
                  onClick={() => goToSlide(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </Group>
          </>
        ) : (
          <Text size="sm" color="dimmed" ta="center" data-testid="pack-empty">
            No puzzles in this pack yet.
          </Text>
        )}
      </CardSection>
    </Card>
  );
};

export default Pack;
