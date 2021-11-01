import { HttpError } from '../helpers/httpError.ts';
import { ensureGet } from '../helpers/methods.ts';
import { file } from '../helpers/response.ts';

export function serveStatic(publicPath: string, serveFolder: string) {
  const pattern = new URLPattern({
    pathname: `${publicPath}(.*)`,
  });

  return async (request: Request): Promise<Response | null> => {
    ensureGet(request);

    const match = pattern.exec(request.url);

    if (!match) {
      throw new HttpError(404);
    }

    const filePath = match.pathname.groups[0];

    if (filePath === '' || filePath === '/') {
      throw new HttpError(404);
    }

    try {
      return await file(`${serveFolder}${match.pathname.groups[0]}`);
    } catch (e) {
      throw new HttpError(e instanceof Deno.errors.NotFound ? 404 : 400);
    }
  };
}
