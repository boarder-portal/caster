import EventStream from 'shared-helpers/EventStream.ts';

import { ServerUser, User } from 'db';

import Stream from './Stream.ts';

export interface StreamStartEvent {
  type: 'streamStart';
  stream: Stream;
}

export interface StreamEndEvent {
  type: 'streamEnd';
  stream: Stream;
}

export type StreamsEvent = StreamStartEvent | StreamEndEvent;

class Streams extends EventStream<StreamsEvent> {
  #liveStreams = new Map<string, Stream>();

  end(login: string) {
    const stream = this.#liveStreams.get(login);

    if (!stream) {
      return;
    }

    stream.end();
    this.#liveStreams.delete(login);
    this.emit({
      type: 'streamEnd',
      stream,
    });
  }

  getLiveStreams(): Map<string, Stream> {
    return this.#liveStreams;
  }

  getStream(login: string): Stream | undefined {
    return this.#liveStreams.get(login);
  }

  async loadLive() {
    for await (const user of User.find({ isLive: true })) {
      this.start(user);
    }
  }

  start(user: ServerUser) {
    const stream = new Stream(user);

    stream.start();
    this.#liveStreams.set(user.login, stream);
    this.emit({
      type: 'streamStart',
      stream,
    });
  }
}

export default new Streams();
