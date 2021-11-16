import { httpErrors } from 'oak';

import { RouterMiddleware } from 'types';

import { User, getPublicUser } from 'db';

export const get: RouterMiddleware<{ login: string }> = async (ctx) => {
  const user = await User.findOne({
    login: ctx.params.login,
  });

  if (!user) {
    throw new httpErrors.NotFound();
  }

  ctx.response.body = {
    user: getPublicUser(user),
  };
};
