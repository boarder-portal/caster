type Subscriber = (login: string, isLive: boolean) => unknown;

class Streams {
  #liveStreams: Set<string>;
  #subscribers: Set<Subscriber>;

  constructor() {
    this.#liveStreams = new Set();
    this.#subscribers = new Set();
  }

  end(login: string) {
    this.#liveStreams.delete(login);

    for (const subscriber of this.#subscribers) {
      subscriber(login, false);
    }
  }

  getLiveStreams(): Set<string> {
    return this.#liveStreams;
  }

  start(login: string) {
    this.#liveStreams.add(login);

    for (const subscriber of this.#subscribers) {
      subscriber(login, true);
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
