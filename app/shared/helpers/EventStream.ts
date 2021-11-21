type Subscriber<T> = (event: T | null) => unknown;

export default class EventStream<T> {
  readonly #subscribers = new Set<Subscriber<T>>();

  #subscribe(subscriber: Subscriber<T>) {
    this.#subscribers.add(subscriber);

    return () => {
      this.#subscribers.delete(subscriber);
    };
  }

  emit(event: T | null) {
    for (const subscriber of this.#subscribers) {
      subscriber(event);
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<T, undefined> {
    const events: (T | null)[] = [];
    let resolveEvent: ((event: T | null) => void) | undefined;

    const unsubscribe = this.#subscribe(
      (event) => {
        if (resolveEvent) {
          resolveEvent(event);
        } else {
          events.push(event);
        }
      },
    );

    return {
      next: async () => {
        const queuedEvent = events.shift();

        if (queuedEvent === null) {
          unsubscribe();

          return {
            value: undefined,
            done: true,
          };
        }

        if (queuedEvent) {
          return {
            value: queuedEvent,
            done: false,
          };
        }

        const event = await new Promise<T | null>((resolve) => resolveEvent = resolve);

        resolveEvent = undefined;

        if (event) {
          return {
            value: event,
            done: false,
          };
        }

        unsubscribe();

        return {
          value: undefined,
          done: true,
        };
      },
      throw: async () => {
        unsubscribe();

        return {
          value: undefined,
          done: true,
        };
      },
      return: async () => {
        unsubscribe();

        return {
          value: undefined,
          done: true,
        };
      },
    };
  }
}
