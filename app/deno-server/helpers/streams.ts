import { PublicStream } from 'types';

import { PrivateUser } from 'db';

interface PrivateStream {
  login: string;
  streamToken: string;
}

type Subscriber = (stream: PrivateStream) => unknown;

class Streams {
  #liveStreams: Map<string, PrivateStream>;
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

  getLiveStreams(): Map<string, PrivateStream> {
    return this.#liveStreams;
  }

  getPublicStream(stream: PrivateStream): PublicStream {
    return {
      login: stream.login,
    };
  }

  start(user: PrivateUser) {
    const stream: PrivateStream = {
      login: user.login,
      streamToken: user.streamToken,
    };

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
