import { httpErrors } from 'oak';

import { RouterMiddleware } from 'types';

import { User } from 'db';

export const live: RouterMiddleware<{ login: string }> = async (ctx) => {
  const user = await User.findOne({
    login: ctx.params.login,
  });

  if (!user || !user.isLive) {
    throw new httpErrors.NotFound();
  }

  const { body, headers } = await fetch(`http://localhost:5391/live/${user.streamToken}.flv`);

  ctx.response.body = body;
  ctx.response.headers = headers;
};
