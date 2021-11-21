type AllowedEvent<T> = T | Error | null;
type Subscriber<T> = (event: AllowedEvent<T>) => unknown;

export default class EventStream<T> {
  readonly #subscribers = new Set<Subscriber<T>>();

  #subscribe(subscriber: Subscriber<T>) {
    this.#subscribers.add(subscriber);

    return () => {
      this.#subscribers.delete(subscriber);
    };
  }

  emit(event: AllowedEvent<T>) {
    for (const subscriber of this.#subscribers) {
      subscriber(event);
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<T, undefined> {
    const events: AllowedEvent<T>[] = [];
    let resolveEvent: ((event: AllowedEvent<T>) => void) | undefined;

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

        if (queuedEvent instanceof Error) {
          unsubscribe();

          throw queuedEvent;
        }

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

        const event = await new Promise<AllowedEvent<T>>((resolve) => resolveEvent = resolve);

        resolveEvent = undefined;

        if (event instanceof Error) {
          unsubscribe();

          throw event;
        }

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
