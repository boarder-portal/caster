import { send } from 'oak';

import { RouterMiddleware } from 'types/all.ts';

export const PUBLIC_PATH = '/public';

export const serveStatic: RouterMiddleware = async (ctx) => {
  await send(ctx, ctx.request.url.pathname.slice(PUBLIC_PATH.length), {
    root: `${Deno.cwd()}/public`,
    index: 'index.html',
  });
};
