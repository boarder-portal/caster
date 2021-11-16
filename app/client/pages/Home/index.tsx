import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { AllLiveStreamsEvents, PublicStream } from 'shared/types';

import WSocket from 'shared/helpers/WSocket';

import * as classes from './index.pcss';

const Home: React.FC = () => {
  const [liveStreams, setLiveStreams] = useState<PublicStream[]>([]);

  useEffect(() => {
    let ws: WSocket<AllLiveStreamsEvents, never> | undefined;

    (async () => {
      ws = new WSocket(`ws://${location.host}/api/stream/subscribeAll`);

      for await (const event of ws) {
        switch (event.type) {
          case 'getLiveStreams': {
            setLiveStreams(event.liveStreams);

            break;
          }
        }
      }
    })();

    return () => {
      ws?.close();
    };
  }, []);

  return (
    <>
      <div className={classes.liveStreams}>
        {liveStreams.map(({ login }) => (
          <div
            key={login}
            className={classes.liveStream}
          >
            <Link
              className={classes.thumbnail}
              to={`/u/${login}`}
              style={{
                backgroundImage: `url(/public/thumbnails/${login}.png)`,
              }}
            />

            <span>
              {login}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default React.memo(Home);
