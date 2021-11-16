import { atom } from 'recoil';

import { PrivateUser } from 'shared/types';

export const userAtom = atom<PrivateUser | null>({
  key: 'user',
  default: window.__USER__,
});
