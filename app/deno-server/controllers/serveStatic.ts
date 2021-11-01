import { Middleware, send } from 'oak';

export const PUBLIC_PATH = '/public';

export const serveStatic: Middleware = async (ctx) => {
  await send(ctx, ctx.request.url.pathname.slice(PUBLIC_PATH.length), {
    root: `${Deno.cwd()}/public`,
    index: 'index.html',
  });
};
