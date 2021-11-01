import { ensureGet } from '../helpers/methods.ts';
import { file } from '../helpers/response.ts';

export async function render(request: Request): Promise<Response> {
  ensureGet(request);

  return await file(`${Deno.cwd()}/public/index.html`);
}
