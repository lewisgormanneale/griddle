'use client';

import { useEffect, useState } from 'react';
import { Center, Loader, Pagination, Stack, Title } from '@mantine/core';
import Pack from '@/components/packs/pack';
import { PackWithProfile, getPacks } from '@/utils/supabase/queries';

export default function PacksPage() {
  const [packs, setPacks] = useState<PackWithProfile[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 12;

  useEffect(() => {
    setLoading(true);
    getPacks({ page, pageSize })
      .then(({ data, count }) => {
        setPacks(data);
        setTotal(count);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <Stack gap="md">
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

      <Center>
        <Pagination
          total={Math.max(1, Math.ceil(total / pageSize))}
          value={page}
          onChange={setPage}
        />
      </Center>
    </Stack>
  );
}
