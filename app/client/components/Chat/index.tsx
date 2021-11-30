import { Input } from '@mui/material';
import classNames from 'classnames';
import last from 'lodash/last';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { WithClassName } from 'client/types';
import { ChatMessage } from 'shared/types';

import { useConstantCallback } from 'client/hooks';
import { userAtom } from 'client/recoil/atoms';

import classes from './index.pcss';

interface Props extends WithClassName {
  messages: ChatMessage[];
  onSendMessage(message: string): void;
}

const Chat: React.FC<Props> = (props) => {
  const { className, messages, onSendMessage } = props;

  const [message, setMessage] = useState('');

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const scrollBottomRef = useRef<number>(0);

  const user = useRecoilValue(userAtom);

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

    onSendMessage(message);

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

  return (
    <div className={classNames(classes.root, className)}>
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
  );
};

export default React.memo(Chat);
