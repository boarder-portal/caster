import { useCallback, useRef } from 'react';

export function useConstantCallback<F extends Function>(callback: F): F {
  const functionRef = useRef<F>(callback);

  functionRef.current = callback;

  return useCallback((...args: any[]) => {
    return functionRef.current(...args);
  }, []) as any;
}
