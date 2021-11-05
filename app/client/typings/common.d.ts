import { PublicUser } from 'shared/types';

declare global {
  interface Window {
    __USER__: PublicUser | null;
  }
}
