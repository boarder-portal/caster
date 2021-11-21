import {
  AllLiveStreamsEvent,
  StreamsServerEvent,
  RouterMiddleware,
} from 'types';

import streams from 'helpers/streams.ts';
import WSocket from 'shared-helpers/WSocket.ts';
import { cancelableAsyncIterable } from 'shared-helpers/cancelableAsyncIterable.ts';

const getAllLiveStreamsEvent = (): AllLiveStreamsEvent => {
  return {
    type: 'getLiveStreams',
    liveStreams: [...streams.getLiveStreams().values()].map((stream) => stream.getPublicStream()),
  };
};

export const subscribeAll: RouterMiddleware = async (ctx) => {
  const ws = new WSocket<unknown, StreamsServerEvent>(await ctx.upgrade());
  const eventStream = cancelableAsyncIterable(streams);

  await ws.opened;

  ws.send(getAllLiveStreamsEvent());

  try {
    await Promise.race([
      (async () => {
        for await (const event of eventStream) {
          switch (event.type) {
            case 'streamStart':
            case 'streamEnd': {
              ws.send(getAllLiveStreamsEvent());

              break;
            }
          }
        }
      })(),
      (async () => {
        for await (const _event of ws) {
          // do nothing
        }
      })(),
    ]);
  } catch {
    eventStream.cancel();
    ws.close();
  }
};
