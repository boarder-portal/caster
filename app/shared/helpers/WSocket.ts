import EventStream from 'shared/helpers/EventStream';

interface SocketEvent {
  type: string;
}

type ExtendedSocketEvent<T> = T | {
  type: '#close';
  code: number;
};

export default class WSocket<
  Incoming extends SocketEvent | unknown,
  Outgoing extends SocketEvent
> extends EventStream<ExtendedSocketEvent<Incoming>> {
  readonly #socket: WebSocket;
  readonly #opened: Promise<void>;

  constructor(socketInit: WebSocket | string) {
    super();

    const socket = typeof socketInit === 'string'
      ? new WebSocket(socketInit)
      : socketInit;

    this.#socket = socket;
    this.#opened = new Promise<void>((resolve) => {
      socket.addEventListener('open', () => resolve());
    });
  }

  get opened(): Promise<void> {
    return this.#opened;
  }

  close(code?: number) {
    this.#socket.close(code);
  }

  async send(event: Outgoing) {
    await this.#opened;

    if (this.#socket.readyState === this.#socket.OPEN) {
      this.#socket.send(JSON.stringify(event));
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<ExtendedSocketEvent<Incoming>, undefined> {
    const iterator = super[Symbol.asyncIterator]();

    const closeListener = (event: CloseEvent) => {
      this.emit({
        type: '#close',
        code: event.code,
      });
      this.emit(null);
    };

    const messageListener = (event: MessageEvent) => {
      this.emit(JSON.parse(event.data));
    };

    const cleanup = () => {
      this.#socket.removeEventListener('close', closeListener);
      this.#socket.removeEventListener('message', messageListener);
    };

    this.#socket.addEventListener('close', closeListener);
    this.#socket.addEventListener('message', messageListener);

    return {
      next: async () => {
        await this.#opened;

        return iterator.next();
      },
      throw: async () => {
        cleanup();

        return await iterator.throw?.() ?? {
          value: undefined,
          done: true,
        };
      },
      return: async () => {
        cleanup();

        return await iterator.return?.() ?? {
          value: undefined,
          done: true,
        };
      },
    };
  }
}
