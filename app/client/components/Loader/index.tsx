import classNames from 'classnames';
import React from 'react';

import { WithClassName } from 'client/types';

import * as classes from './index.pcss';

interface Props extends WithClassName {}

const Loader: React.FC<Props> = (props) => {
  const { className } = props;

  return (
    <svg className={classNames(classes.root, className)} width="24" height="24" viewBox="0 0 24 24">
      <circle className={classes.arc} r="11" cx="12" cy="12" />
    </svg>
  );
};

export default React.memo(Loader);
