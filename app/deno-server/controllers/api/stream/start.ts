import { httpErrors } from 'oak';

import { RouterMiddleware } from 'types';

import streams from 'helpers/streams.ts';

import { User } from 'db';

export const start: RouterMiddleware<{ token: string }> = async (ctx) => {
  const user = await User.findOne({
    streamToken: ctx.params.token,
  });

  if (!user) {
    throw new httpErrors.NotFound();
  }

  if (user.isLive) {
    throw new httpErrors.Conflict();
  }

  await User.updateOne(
    { _id: user._id },
    { $set: { isLive: true } },
  );

  streams.change({
    ...user,
    isLive: true,
  });

  ctx.response.body = {};
};
