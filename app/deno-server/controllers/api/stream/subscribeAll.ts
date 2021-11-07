import {
  AllLiveStreamsEvent,
  AllLiveStreamsEvents,
  RouterMiddleware,
} from 'types';

import streams from 'helpers/streams.ts';
import WSocket from 'shared-helpers/WSocket.ts';

const getAllLiveStreamsEvent = (): AllLiveStreamsEvent => {
  return {
    type: 'getLiveStreams',
    liveStreams: [...streams.getLiveStreams().keys()],
  };
};

export const subscribeAll: RouterMiddleware = async (ctx) => {
  const ws = new WSocket<unknown, AllLiveStreamsEvents>(await ctx.upgrade());

  await ws.opened;

  ws.send(getAllLiveStreamsEvent());

  const unsubscribe = streams.subscribe(() => {
    ws.send(getAllLiveStreamsEvent());
  });

  try {
    for await (const _event of ws) {
      // do nothing
    }
  } catch {
    ws.close();
  } finally {
    unsubscribe();
  }
};
