import { Middleware } from 'oak';

export const getAllStreams: Middleware = async (ctx) => {
  ctx.response.body = [];
};
