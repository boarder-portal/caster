import React from 'react';

import Player from 'client/components/Player';

import classes from './index.pcss';

const Home: React.FC = () => {
  return (
    <div className={classes.playerContainer}>
      <Player className={classes.player} id="droooney" />
    </div>
  );
};

export default React.memo(Home);
