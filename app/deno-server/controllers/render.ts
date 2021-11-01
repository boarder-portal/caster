import { Middleware, send } from 'oak';

export const render: Middleware = async (ctx) => {
  await send(ctx, 'index.html', {
    root: `${Deno.cwd()}/public`,
    index: 'index.html',
  });
};
