import React from 'react';

import * as classes from './index.pcss';

const App: React.FC = () => {
  return (
    <div className={classes.root}>
      Caster App
    </div>
  );
};

export default React.memo(App);
