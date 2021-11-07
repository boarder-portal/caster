interface SocketEvent {
  type: string;
}

export default class WSocket<Incoming extends SocketEvent | unknown, Outgoing extends SocketEvent> {
  readonly #socket: WebSocket;
  readonly #opened: Promise<void>;

  constructor(socketInit: WebSocket | string) {
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

  close() {
    this.#socket.close();
  }

  async send(event: Outgoing) {
    await this.#opened;

    this.#socket.send(JSON.stringify(event));
  }

  [Symbol.asyncIterator](): AsyncIterator<Incoming, undefined> {
    const messages: string[] = [];
    let resolveClose: (() => void) | undefined;
    let resolveMessage: ((message: string) => void) | undefined;

    const closeListener = () => {
      resolveClose?.();
    };

    const messageListener = (event: MessageEvent) => {
      if (resolveMessage) {
        resolveMessage(event.data);
      } else {
        messages.push(event.data);
      }
    };

    this.#socket.addEventListener('close', closeListener);
    this.#socket.addEventListener('message', messageListener);

    return {
      next: async () => {
        await this.#opened;

        if (this.#socket.readyState === this.#socket.CLOSED) {
          return {
            value: undefined,
            done: true,
          };
        }

        const queuedMessage = messages.shift();

        if (queuedMessage) {
          return {
            value: JSON.parse(queuedMessage),
            done: false,
          };
        }

        const message = await Promise.race([
          new Promise<string>((resolve) => resolveMessage = resolve),
          new Promise<void>((resolve) => resolveClose = resolve),
        ]);

        resolveMessage = undefined;

        if (typeof message === 'string') {
          return {
            value: JSON.parse(message),
            done: false,
          };
        }

        return {
          value: undefined,
          done: true,
        };
      },
      throw: async () => {
        this.#socket.removeEventListener('close', closeListener);
        this.#socket.removeEventListener('message', messageListener);

        return {
          value: undefined,
          done: true,
        };
      },
      return: async () => {
        this.#socket.removeEventListener('close', closeListener);
        this.#socket.removeEventListener('message', messageListener);

        return {
          value: undefined,
          done: true,
        };
      },
    };
  }
}
