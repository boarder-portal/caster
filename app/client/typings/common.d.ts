import { PrivateUser } from 'shared/types';

declare global {
  interface Window {
    __USER__: PrivateUser | null;
  }
}
