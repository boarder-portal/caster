import { Input } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';

import Player from 'client/components/Player';

import { userAtom } from 'client/recoil/atoms';

import classes from './index.pcss';

interface Props {
  login: string;
}

const Stream: React.FC<Props> = (props) => {
  const { login } = props;

  const [message, setMessage] = useState('');

  const user = useRecoilValue(userAtom);

  const sendMessage = useCallback(() => {
    console.log('send message', message);

    setMessage('');
  }, [message]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const onMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

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
              value={message}
              onChange={onMessageChange}
              onKeyDown={onKeyDown}
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
