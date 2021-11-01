import { HttpError } from './httpError.ts';

export function ensureGet(request: Request) {
  if (request.method !== 'GET') {
    throw new HttpError(405);
  }
}
