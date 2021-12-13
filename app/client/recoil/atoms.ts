import { atom } from 'recoil';

import { PrivateUser } from 'shared/types';

export const userAtom = atom<PrivateUser | null>({
  key: 'user',
  default: window.__USER__,
});

export const isMobileAtom = atom<boolean>({
  key: 'isMobile',
  default: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
});
