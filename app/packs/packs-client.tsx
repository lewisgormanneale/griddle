'use client';

import { useCallback, useState } from 'react';
import { Center, Loader, Pagination } from '@mantine/core';
import Pack from '@/components/packs/pack';
import { useAsyncData } from '@/hooks/use-async-data';
import { PackWithProfile, getPacks } from '@/utils/supabase/queries';

export function PacksClient() {
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const loadPacks = useCallback(() => getPacks({ page, pageSize }), [page]);
  const { data: packResult, loading } = useAsyncData<{ data: PackWithProfile[]; count: number }>(
    loadPacks,
    [loadPacks],
    {
      initialData: { data: [], count: 0 },
    }
  );
  const packs = packResult?.data ?? [];
  const total = packResult?.count ?? 0;

  return (
    <div data-testid="packs-client">
      {loading ? (
        <Center data-testid="packs-loading">
          <Loader />
        </Center>
      ) : (
        packs.map((pack) => <Pack key={pack.id} pack={pack} />)
      )}

      <Center mt="md">
        <Pagination
          data-testid="packs-pagination"
          total={Math.max(1, Math.ceil(total / pageSize))}
          value={page}
          onChange={setPage}
        />
      </Center>
    </div>
  );
}
