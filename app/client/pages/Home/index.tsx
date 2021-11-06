import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { AllLiveStreamsEvents } from 'shared/types';

import WSocket from 'shared/helpers/WSocket';

const Home: React.FC = () => {
  useEffect(() => {
    let ws: WSocket<AllLiveStreamsEvents, never> | undefined;

    (async () => {
      ws = new WSocket(`ws://${location.host}/api/stream/subscribeAll`);

      for await (const event of ws) {
        console.log(event);
      }
    })();

    return () => {
      ws?.close();
    };
  }, []);

  return (
    <div>
      <Link to="/u/123">
        123
      </Link>
    </div>
  );
};

export default React.memo(Home);
