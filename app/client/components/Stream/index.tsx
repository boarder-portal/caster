import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { ChatMessage, StreamClientEvent, StreamServerEvent } from 'shared/types';

import WSocket from 'shared/helpers/WSocket';

import Chat from 'client/components/Chat';
import Player from 'client/components/Player';

import { useConstantCallback, useContentScroll } from 'client/hooks';
import { isMobileAtom } from 'client/recoil/atoms';

import classes from './index.pcss';

interface Props {
  login: string;
  onStreamEnd(): void;
}

const Stream: React.FC<Props> = (props) => {
  const { login, onStreamEnd } = props;

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const wsRef = useRef<WSocket<StreamServerEvent, StreamClientEvent> | null>(null);
  const closedExternallyRef = useRef<boolean>(false);

  const isMobile = useRecoilValue(isMobileAtom);

  const sendMessage = useConstantCallback((message: string) => {
    wsRef.current?.send({
      type: 'sendMessage',
      message,
    });
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

  useContentScroll(!isMobile);

  if (!login) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={classes.playerContainer}>
        <Player className={classes.player} id={login} />
      </div>

      <Chat
        className={classes.chat}
        messages={messages}
        onSendMessage={sendMessage}
      />
    </div>
  );
};

export default React.memo(Stream);
