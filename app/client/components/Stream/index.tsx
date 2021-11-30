import { Input } from '@mui/material';
import last from 'lodash/last';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { ChatMessage, StreamClientEvent, StreamServerEvent } from 'shared/types';

import WSocket from 'shared/helpers/WSocket';

import Player from 'client/components/Player';

import { useConstantCallback, useContentScroll } from 'client/hooks';
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
  const scrollBottomRef = useRef<number>(0);

  const user = useRecoilValue(userAtom);
  const isMobile = useRecoilValue(isMobileAtom);

  const getScrollBottom = useConstantCallback(() => {
    const messages = messagesRef.current;

    if (!messages) {
      return NaN;
    }

    return messages.scrollHeight - messages.clientHeight - messages.scrollTop;
  });

  const setScrollBottom = useConstantCallback((scrollBottom: number) => {
    const messages = messagesRef.current;

    if (!messages) {
      return;
    }

    messages.scrollTop = messages.scrollHeight - messages.clientHeight - scrollBottom;
  });

  const sendMessage = useConstantCallback(() => {
    if (!message) {
      return;
    }

    wsRef.current?.send({
      type: 'sendMessage',
      message,
    });

    setMessage('');
  });

  const onKeyDown = useConstantCallback((e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  const onMessageChange = useConstantCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  });

  const onScroll = useConstantCallback(() => {
    scrollBottomRef.current = getScrollBottom();
  });

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
    const lastMessage = last(messagesRef.current?.children);

    if (!lastMessage) {
      return;
    }

    const scrollBottom = getScrollBottom();

    if (scrollBottom <= lastMessage.clientHeight + 10) {
      setScrollBottom(0);
    }
  }, [getScrollBottom, messages.length, setScrollBottom]);

  useEffect(() => {
    const messages = messagesRef.current;

    if (!messages) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setScrollBottom(scrollBottomRef.current);
    });

    observer.observe(messages, {
      box: 'border-box',
    });

    return () => {
      observer.disconnect();
    };
  }, [setScrollBottom]);

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
        <div ref={messagesRef} className={classes.messages} onScroll={onScroll}>
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
