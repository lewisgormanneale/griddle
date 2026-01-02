import { DependencyList, useEffect, useState } from 'react';

type Options<T> = {
  initialData?: T;
  enabled?: boolean;
};

export function useAsyncData<T>(
  load: () => Promise<T>,
  deps: DependencyList,
  { initialData, enabled = true }: Options<T> = {}
) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    load()
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(error);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [...deps, enabled]);

  return { data, loading, setData };
}
