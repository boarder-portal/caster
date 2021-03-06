export type Dictionary<T> = Partial<Record<string, T>>;

export interface PrivateUser {
  _id: string;
  login: string;
  isLive: boolean;
  streamToken: string;
}

export interface PublicUser {
  login: string;
  isLive: boolean;
}

export interface PublicStream {
  user: PublicUser;
  duration: number;
}

export interface ChatMessage {
  user: PublicUser;
  message: string;
}

export interface AllLiveStreamsEvent {
  type: 'getLiveStreams';
  liveStreams: PublicStream[];
}

export type StreamsServerEvent = AllLiveStreamsEvent;

export interface SendMessageEvent {
  type: 'sendMessage';
  message: string;
}

export interface MessageSentEvent {
  type: 'messageSent';
  message: ChatMessage;
}

export type StreamServerEvent = MessageSentEvent;

export type StreamClientEvent = SendMessageEvent;
