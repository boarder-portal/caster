import { RouterMiddleware } from 'types/all.ts';

export const logout: RouterMiddleware = async (ctx) => {
  await ctx.state.session.set('userId', null);

  ctx.response.body = {};
};
