export class HttpError extends Error {
  readonly #response: Response;

  constructor(message: string, response: Response) {
    super(message);

    this.#response = response;
  }

  getResponse(): Response {
    return this.#response;
  }
}

export default class ApiClient {
  static #isSuccess(response: Response): boolean {
    return response.status < 300 || response.status === 304;
  }

  #baseUrl = `${location.origin}/api`;

  async #request(url: URL, init?: RequestInit) {
    const response = await fetch(url.toString(), init);

    if (!ApiClient.#isSuccess(response)) {
      throw new HttpError(
        `Bad status code: ${response.status}`,
        response,
      );
    }

    return response.json();
  }

  get<T>(url: string, query: Record<string, string> = {}): Promise<T> {
    const urlObject = new URL(this.#baseUrl + url);

    for (const key in query) {
      if (!{}.hasOwnProperty.call(query, key)) {
        continue;
      }

      urlObject.searchParams.set(key, query[key]);
    }

    return this.#request(urlObject, {
      method: 'GET',
    });
  }

  post<T>(url: string, body?: object): Promise<T> {
    return this.#request(new URL(this.#baseUrl + url), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
