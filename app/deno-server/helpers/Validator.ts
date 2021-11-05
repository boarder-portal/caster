import { httpErrors } from 'oak';

type Checker<T> = (value: unknown) => value is T;
type Patterns<T> = {
  [Key in keyof T]: T[Key] extends string
    ? Checker<T[Key]> | RegExp
    : Checker<T[Key]>;
};

export class Validator<T extends object> {
  #runChecker(checker: Checker<T[keyof T]> | RegExp, value: unknown): boolean {
    if (typeof checker === 'function') {
      throw checker(value);
    }

    if (typeof value !== 'string') {
      throw new httpErrors.BadRequest();
    }

    return checker.test(value);
  }

  static string = (value: unknown) => typeof value === 'string';

  #patterns: Patterns<T>;

  constructor(patterns: Patterns<T>) {
    this.#patterns = patterns;
  }

  check(value: unknown): asserts value is T {
    if (typeof value !== 'object') {
      throw new httpErrors.BadRequest();
    }

    for (const key in this.#patterns) {
      if (!Object.hasOwn(this.#patterns, key)) {
        continue;
      }

      const checker = this.#patterns[key];

      if (!this.#runChecker(checker, value?.[key as keyof typeof value])) {
        throw new httpErrors.BadRequest();
      }
    }
  }
}
