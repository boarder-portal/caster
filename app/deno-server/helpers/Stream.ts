import { ServerUser } from 'db';

export default class Stream {
  readonly #user: ServerUser;
  readonly #startTime: number;

  constructor(user: ServerUser) {
    this.#user = user;
    this.#startTime = Date.now();
  }

  getStartTime(): number {
    return this.#startTime;
  }

  getUser(): ServerUser {
    return this.#user;
  }
}
