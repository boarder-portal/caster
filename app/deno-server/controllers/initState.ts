import { Bson } from 'mongo';

import { RouterMiddleware } from 'types';

import { User } from 'db';

export const initState: RouterMiddleware = async (ctx, next) => {
  ctx.state.user = await User.findOne({
    _id: new Bson.ObjectId(await ctx.state.session.get('userId')),
  });

  await next();
};
