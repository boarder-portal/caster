import { useRef, useState } from 'react';

import { delay } from 'shared/helpers/delay';

export function usePlayPauseController() {
  const [isInProcess, setIsInProcess] = useState(false);

  const abortController = useRef<AbortController | null>(null);

  return {
    isInProcess,
    cancelProcess() {
      abortController.current?.abort();
    },
    async startProcess() {
      abortController.current = new AbortController();

      setIsInProcess(true);

      try {
        await Promise.race([
          delay(200),
          new Promise((_resolve, reject) => {
            abortController.current?.signal.addEventListener('abort', () => {
              reject(new Error('Process aborted'));
            });
          }),
        ]);
      } finally {
        setIsInProcess(false);
      }
    },
  };
}
