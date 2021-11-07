export type Dictionary<T> = Partial<Record<string, T>>;

export interface PublicUser {
  _id: string;
  login: string;
  isLive: boolean;
  streamToken: string;
}

export interface PublicStream {
  login: string;
}

export interface AllLiveStreamsEvent {
  type: 'getLiveStreams';
  liveStreams: PublicStream[];
}

export type AllLiveStreamsEvents = AllLiveStreamsEvent;
