type HttpErrorCode = 400 | 404 | 405 | 500;

const errorTexts: Record<HttpErrorCode, string> = {
  400: 'Bad Request',
  404: 'Not Found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error',
};

export class HttpError extends Error {
  code: HttpErrorCode;

  constructor(code: HttpErrorCode) {
    super(errorTexts[code]);

    this.code = code;
  }
}
