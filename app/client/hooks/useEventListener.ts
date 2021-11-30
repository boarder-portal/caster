/* eslint-disable no-redeclare */
import { useEffect } from 'react';

import { useConstantCallback } from 'client/hooks/useConstantCallback';

export function useEventListener<K extends keyof DocumentEventMap>(
  event: K,
  listener: (event: DocumentEventMap[K]) => unknown,
  target: Document,
): void;
export function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  listener: (event: WindowEventMap[K]) => unknown,
  target: Window,
): void;

export function useEventListener<K extends keyof(DocumentEventMap | WindowEventMap)>(
  event: K,
  listener: (event: (DocumentEventMap | WindowEventMap)[K]) => unknown,
  target: Window | Document,
): void {
  const constantListener = useConstantCallback(listener);

  useEffect(() => {
    target.addEventListener(event, constantListener as any);

    return () => {
      target.removeEventListener(event, constantListener as any);
    };
  }, [constantListener, event, target]);
}
