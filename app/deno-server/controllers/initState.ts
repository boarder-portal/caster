import { Bson } from 'mongo';

import { RouterMiddleware } from 'types/all.ts';

import { User } from 'helpers/db.ts';

export const initState: RouterMiddleware = async (ctx, next) => {
  ctx.state.user = await User.findOne({
    _id: new Bson.ObjectId(await ctx.state.session.get('userId')),
  });

  await next();
};
