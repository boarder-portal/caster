import { PublicStream } from 'types';

import { ServerUser, User, getPublicUser } from 'db';

import Stream from './Stream.ts';

type Subscriber = (stream: Stream) => unknown;

class Streams {
  #liveStreams: Map<string, Stream>;
  #subscribers: Set<Subscriber>;

  constructor() {
    this.#liveStreams = new Map();
    this.#subscribers = new Set();
  }

  end(login: string) {
    const stream = this.#liveStreams.get(login);

    if (!stream) {
      return;
    }

    this.#liveStreams.delete(login);

    for (const subscriber of this.#subscribers) {
      subscriber(stream);
    }
  }

  getLiveStreams(): Map<string, Stream> {
    return this.#liveStreams;
  }

  getPublicStream(stream: Stream): PublicStream {
    return {
      user: getPublicUser(stream.getUser()),
      duration: Date.now() - stream.getStartTime(),
    };
  }

  async loadLive() {
    for await (const user of User.find({ isLive: true })) {
      this.start(user);
    }
  }

  start(user: ServerUser) {
    const stream = new Stream(user);

    this.#liveStreams.set(user.login, stream);

    for (const subscriber of this.#subscribers) {
      subscriber(stream);
    }
  }

  subscribe(subscriber: Subscriber) {
    this.#subscribers.add(subscriber);

    return () => {
      this.#subscribers.delete(subscriber);
    };
  }
}

export default new Streams();
