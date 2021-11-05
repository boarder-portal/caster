import { RouterMiddleware } from 'types/all.ts';

export const getAllStreams: RouterMiddleware = async (ctx) => {
  ctx.response.body = [];
};
