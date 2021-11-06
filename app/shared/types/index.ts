export type Dictionary<T> = Partial<Record<string, T>>;

export interface PublicUser {
  _id: string;
  login: string;
  isLive: boolean;
  streamToken: string;
}

export interface AllLiveStreamsEvent {
  type: 'getLiveStreams';
  liveStreams: string[];
}

export type AllLiveStreamsEvents = AllLiveStreamsEvent;
