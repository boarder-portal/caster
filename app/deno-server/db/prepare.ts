import { Dictionary } from 'types';

import { delay } from 'shared-helpers/delay.ts';

import { User } from 'db';

interface StreamsResponse {
  live?: Dictionary<unknown>;
}

export async function prepare() {
  let response: StreamsResponse | undefined;

  while (!response) {
    try {
      const res = await fetch('http://localhost:5391/api/streams');

      response = await res.json();
    } catch {
      await delay(1000);
    }
  }

  const liveStreamTokens = Object.keys(response.live ?? {});

  await User.updateMany({}, [
    {
      $set: {
        isLive: {
          $in: ['$streamToken', liveStreamTokens],
        },
      },
    },
  ]);
}
