import { PrivateUser, User } from 'db';

type Subscriber = (user: PrivateUser) => unknown;

class Streams {
  #liveStreams: Map<string, PrivateUser>;
  #subscribers: Set<Subscriber>;

  constructor() {
    this.#liveStreams = new Map();
    this.#subscribers = new Set();
  }

  change(user: PrivateUser) {
    if (user.isLive) {
      this.#liveStreams.set(user.login, user);
    } else {
      this.#liveStreams.delete(user.login);
    }

    for (const subscriber of this.#subscribers) {
      subscriber(user);
    }
  }

  getLiveStreams(): Map<string, PrivateUser> {
    return this.#liveStreams;
  }

  subscribe(subscriber: Subscriber) {
    this.#subscribers.add(subscriber);

    return () => {
      this.#subscribers.delete(subscriber);
    };
  }
}

export default new Streams();
