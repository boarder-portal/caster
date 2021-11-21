import { useEffect } from 'react';

export function useContentScroll(scroll: boolean) {
  useEffect(() => {
    document.body.style.setProperty('--scroll', String(Number(scroll)));

    return () => {
      document.body.style.removeProperty('--scroll');
    };
  }, [scroll]);
}
