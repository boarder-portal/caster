import { useState } from 'react';

import { useConstantCallback } from 'client/hooks/useConstantCallback';

interface AsyncDataBase {
  load(): Promise<void>;
}

interface AsyncDataNone extends AsyncDataBase {
  data: null;
  isLoading: false;
  error: null;
}

interface AsyncDataLoading extends AsyncDataBase {
  data: null;
  isLoading: true;
  error: null;
}

interface AsyncDataSuccess<T> extends AsyncDataBase {
  data: T;
  isLoading: false;
  error: null;
}

interface AsyncDataFailure extends AsyncDataBase {
  data: null;
  isLoading: false;
  error: unknown;
}

type AsyncData<T> = AsyncDataNone | AsyncDataLoading | AsyncDataSuccess<T> | AsyncDataFailure;

export function useAsyncData<T>(loader: () => Promise<T>): AsyncData<T> {
  const load = useConstantCallback(async () => {
    try {
      setAsyncData({
        data: null,
        isLoading: true,
        error: null,
        load,
      });

      const data = await loader();

      setAsyncData({
        data,
        isLoading: false,
        error: null,
        load,
      });
    } catch (err) {
      setAsyncData({
        data: null,
        isLoading: false,
        error: err,
        load,
      });
    }
  });

  const [asyncData, setAsyncData] = useState<AsyncData<T>>({
    data: null,
    isLoading: false,
    error: null,
    load,
  });

  return asyncData;
}
