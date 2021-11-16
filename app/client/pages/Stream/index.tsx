import { Input } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Player from 'client/components/Player';

import { userAtom } from 'client/recoil/atoms';

import classes from './index.pcss';

const Stream: React.FC = () => {
  const { login } = useParams<'login'>();

  const user = useRecoilValue(userAtom);

  console.log(user, login);

  if (!login) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={classes.playerContainer}>
        <Player className={classes.player} id={login} />
      </div>

      <div className={classes.chat}>
        <div className={classes.messages}>

        </div>

        <div className={classes.inputContainer}>
          {user ? (
            <Input
              className={classes.input}
              placeholder="Type a message"
              multiline
              maxRows={4}
              disableUnderline
            />
          ) : (
            <span className={classes.alert}>
              Log in to chat
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Stream);
