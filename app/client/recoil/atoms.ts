import { atom } from 'recoil';

import { PublicUser } from 'shared/types';

export const userAtom = atom<PublicUser | null>({
  key: 'user',
  default: window.__USER__,
});
