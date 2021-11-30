import { useState } from 'react';

import { useConstantCallback } from 'client/hooks/useConstantCallback';

export function useLocalStorageState<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(
    JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue,
  );

  return [
    value,
    useConstantCallback((value) => {
      localStorage.setItem(key, JSON.stringify(value));
      setValue(value);
    }),
  ];
}
