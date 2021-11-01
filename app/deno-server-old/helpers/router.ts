import { HttpError } from './httpError.ts';

type Responder = (request: Request) => Promise<Response | null | never> | never;
type Handler = Responder | Router;
type PathMap = Record<string | symbol, Handler>;

interface Path {
  pattern: URLPattern;
  handler: Handler;
}

declare global {
  interface Request {
    urlMatch: Record<string, string>;
  }
}

export class Router {
  readonly #paths: Path[];
  readonly #fallback: Handler | null = null;

  static fallback = Symbol('Router.fallback');

  static async #getResponse(
    request: Request,
    handler: Handler,
    url: URL,
    matchGroups: Record<string, string>,
  ): Promise<Response | null> {
    if (typeof handler === 'function') {
      request.urlMatch = matchGroups;

      return handler(request);
    }

    return handler.#respond(request, url, matchGroups);
  }

  static async notFound(): Promise<never> {
    throw new HttpError(404);
  }

  constructor(pathMap: PathMap) {
    this.#paths = Object.entries(pathMap).map(([path, handler]) => {
      return {
        pattern: new URLPattern({
          pathname: `/${path}(.*)`,
        }),
        handler,
      };
    });

    if (Router.fallback in pathMap) {
      this.#fallback = pathMap[Router.fallback];
    }
  }

  async #respond(request: Request, url: URL, matchGroups: Record<string, string>): Promise<Response | null> {
    for (const { pattern, handler } of this.#paths) {
      const match = pattern.exec(url);

      if (!match) {
        continue;
      }

      const cloneUrl = new URL(url.toString());

      cloneUrl.pathname = match.pathname.groups[0];

      const response = await Router.#getResponse(request, handler, cloneUrl, {
        ...matchGroups,
        ...Object.keys(match.pathname.groups)
          .filter((key) => !/^\d+$/.test(key))
          .reduce((groups, key) => ({
            ...groups,
            [key]: match.pathname.groups[key],
          }), {}),
      });

      if (response) {
        return response;
      }
    }

    if (!this.#fallback) {
      return null;
    }

    return Router.#getResponse(request, this.#fallback, url, matchGroups);
  }

  async handle(requestEvent: Deno.RequestEvent): Promise<boolean> {
    const response = await this.#respond(
      requestEvent.request,
      new URL(requestEvent.request.url),
      {},
    );

    if (!response) {
      return false;
    }

    await requestEvent.respondWith(response);

    return true;
  }
}
