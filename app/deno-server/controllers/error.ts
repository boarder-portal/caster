import { Middleware, Status, STATUS_TEXT, isHttpError } from 'oak';

export const error: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    let status: Status;

    if (isHttpError(e)) {
      status = e.status;
    } else {
      console.log('Server error', e);

      status = Status.InternalServerError;
    }

    ctx.response.status = status;
    ctx.response.body = STATUS_TEXT.get(status);
  }
};
