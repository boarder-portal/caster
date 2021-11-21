import { Input } from '@mui/material';
import last from 'lodash/last';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { ChatMessage, StreamClientEvent, StreamServerEvent } from 'shared/types';

import WSocket from 'shared/helpers/WSocket';

import Player from 'client/components/Player';

import { useContentScroll } from 'client/hooks';
import { isMobileAtom, userAtom } from 'client/recoil/atoms';

import classes from './index.pcss';

interface Props {
  login: string;
  onStreamEnd(): void;
}

const Stream: React.FC<Props> = (props) => {
  const { login, onStreamEnd } = props;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const wsRef = useRef<WSocket<StreamServerEvent, StreamClientEvent> | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const closedExternallyRef = useRef<boolean>(false);

  const user = useRecoilValue(userAtom);
  const isMobile = useRecoilValue(isMobileAtom);

  const sendMessage = useCallback(() => {
    if (!message) {
      return;
    }

    wsRef.current?.send({
      type: 'sendMessage',
      message,
    });

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

  useEffect(() => {
    const ws = new WSocket<StreamServerEvent, StreamClientEvent>(`ws://${location.host}/api/stream/subscribe/${login}`);

    wsRef.current = ws;

    (async () => {
      for await (const event of ws) {
        switch (event.type) {
          case 'messageSent': {
            setMessages((messages) => [...messages, event.message]);

            break;
          }
        }
      }

      if (closedExternallyRef.current) {
        return;
      }

      onStreamEnd();
    })();

    return () => {
      closedExternallyRef.current = true;
      ws.close();
    };
  }, [login, onStreamEnd]);

  useEffect(() => {
    const messages = messagesRef.current;

    if (!messages) {
      return;
    }

    const lastMessage = last(messages.children);

    if (!lastMessage) {
      return;
    }

    const maxScroll = messages.scrollHeight - messages.clientHeight;

    if (maxScroll - messages.scrollTop - 10 <= lastMessage.clientHeight) {
      messages.scrollTop = maxScroll;
    }
  }, [messages.length]);

  useContentScroll(!isMobile);

  if (!login) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={classes.playerContainer}>
        <Player className={classes.player} id={login} />
      </div>

      <div className={classes.chat}>
        <div ref={messagesRef} className={classes.messages}>
          {messages.map(({ user, message }, index) => {
            return (
              <div key={index}>
                <span className={classes.login}>
                  {user.login}
                </span>
                {' '}
                {message}
              </div>
            );
          })}
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
