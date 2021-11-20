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

export interface AllLiveStreamsEvent {
  type: 'getLiveStreams';
  liveStreams: PublicStream[];
}

export type AllLiveStreamsEvents = AllLiveStreamsEvent;
