import { SendMessageEvent, StreamServerEvent, PublicStream } from 'types';

import EventStream from 'shared-helpers/EventStream.ts';

import { ServerUser, getPublicUser } from 'db';

export default class Stream extends EventStream<StreamServerEvent> {
  readonly #user: ServerUser;
  readonly #startTime = Date.now();

  constructor(user: ServerUser) {
    super();

    this.#user = user;
  }

  end() {
    this.#user.isLive = false;

    this.emit(null);
  }

  getPublicStream(): PublicStream {
    return {
      user: getPublicUser(this.#user),
      duration: Date.now() - this.#startTime,
    };
  }

  getStartTime(): number {
    return this.#startTime;
  }

  getUser(): ServerUser {
    return this.#user;
  }

  isSendMessageEvent(event: any): event is SendMessageEvent {
    return (
      event?.type === 'sendMessage'
      && typeof event.message === 'string'
    );
  }

  messageSent(message: string) {
    this.emit({
      type: 'messageSent',
      message,
    });
  }

  start() {
    this.#user.isLive = true;
  }
}
