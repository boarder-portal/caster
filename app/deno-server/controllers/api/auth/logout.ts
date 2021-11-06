import { RouterMiddleware } from 'types';

export const logout: RouterMiddleware = async (ctx) => {
  await ctx.state.session.set('userId', null);

  ctx.response.body = {};
};
