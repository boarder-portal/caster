import { RouterMiddleware } from 'types';

import { getPrivateUser } from 'db';

export const render: RouterMiddleware = async (ctx) => {
  const indexFile = await Deno.readTextFile(`${Deno.cwd()}/public/index.html`);
  const indexContent = indexFile.replace(
    '__USER_STRING__',
    JSON.stringify(ctx.state.user ? getPrivateUser(ctx.state.user) : null).replace(/</g, '\\u003c'),
  );

  ctx.response.body = indexContent;
};
