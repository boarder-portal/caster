import { httpErrors } from 'oak';

import {
  StreamServerEvent,
  RouterMiddleware,
} from 'types';

import streams from 'helpers/streams.ts';
import WSocket from 'shared-helpers/WSocket.ts';
import { cancelableAsyncIterable } from 'shared-helpers/cancelableAsyncIterable.ts';

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
          if (stream.isSendMessageEvent(event)) {
            stream.messageSent(event.message);
          }
        }
      })(),
    ]);
  } catch {
    eventStream.cancel();
    ws.close();
  }
};
