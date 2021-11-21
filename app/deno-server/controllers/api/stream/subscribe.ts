import { httpErrors } from 'oak';

import {
  StreamServerEvent,
  RouterMiddleware,
} from 'types';

import streams from 'helpers/streams.ts';
import WSocket from 'shared-helpers/WSocket.ts';
import { cancelableAsyncIterable } from 'shared-helpers/cancelableAsyncIterable.ts';

import { getPublicUser } from 'db';

export const subscribe: RouterMiddleware<{ login: string }> = async (ctx) => {
  const ws = new WSocket<unknown, StreamServerEvent>(await ctx.upgrade());

  await ws.opened;

  const stream = streams.getStream(ctx.params.login);

  if (!stream) {
    throw new httpErrors.NotFound();
  }

  const eventStream = cancelableAsyncIterable(stream);

  try {
    await Promise.race([
      (async () => {
        for await (const event of eventStream) {
          ws.send(event);
        }
      })(),
      (async () => {
        for await (const event of ws) {
          const { user } = ctx.state;

          if (stream.isSendMessageEvent(event) && user) {
            stream.messageSent({
              user: getPublicUser(user),
              message: event.message,
            });
          }
        }
      })(),
    ]);
  } catch {
    eventStream.cancel();
    ws.close();
  }
};
