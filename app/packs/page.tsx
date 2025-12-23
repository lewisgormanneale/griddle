'use client';

import { useEffect, useState } from 'react';
import { Center, Loader, Stack, Title } from '@mantine/core';
import Pack from '@/components/packs/pack';
import { Tables } from '@/types/database.types';
import { getAllPacks } from '@/utils/supabase/queries';
import classes from './page.module.css';

export default function PacksPage() {
  const [packs, setPacks] = useState<Tables<'packs'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPacks()
      .then((data) => setPacks(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Stack className={classes.page} gap="md">
      <Title order={1} ta="center">
        Packs
      </Title>

      {loading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        packs.map((pack) => <Pack key={pack.id} pack={pack} />)
      )}
    </Stack>
  );
}
