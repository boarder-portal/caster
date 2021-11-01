import React from 'react';

import Player from 'client/components/Player';

import * as classes from './index.pcss';

const App: React.FC = () => {
  return (
    <div className={classes.root}>
      <h1 className={classes.header}>
        Caster App
      </h1>

      <div className={classes.playerContainer}>
        <Player className={classes.player} id="droooney" />
      </div>
    </div>
  );
};

export default React.memo(App);
