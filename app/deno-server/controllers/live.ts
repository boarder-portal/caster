import { RouterMiddleware } from 'types/all.ts';

export const live: RouterMiddleware<{ streamPath: string }> = async (ctx) => {
  const { body, headers } = await fetch(`http://localhost:5391/live/${ctx.params.streamPath}.flv`);

  ctx.response.body = body;
  ctx.response.headers = headers;
};
