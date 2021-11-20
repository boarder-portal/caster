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

  useEffect(() => {
    let timestamp = Date.now();

    const id = setInterval(() => {
      const newTimestamp = Date.now();
      const timeDiff = newTimestamp - timestamp;

      timestamp = newTimestamp;

      setLiveStreams((liveStreams) => {
        return liveStreams.map((stream) => ({
          ...stream,
          duration: stream.duration + timeDiff,
        }));
      });
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <div className={classes.liveStreams}>
        {liveStreams.map(({ user }) => (
          <div
            key={user.login}
            className={classes.liveStream}
          >
            <Link
              className={classes.thumbnail}
              to={`/u/${user.login}`}
              style={{
                backgroundImage: `url(/public/thumbnails/${user.login}.png)`,
              }}
            />

            <span>
              {user.login}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default React.memo(Home);
