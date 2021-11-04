import { HttpError } from './helpers/httpError.ts';

import main from './routes/main.ts';

console.log('Start server');

const server = Deno.listen({
  port: 7766,
});

console.log('Listening...');

for await (const connection of server) {
  const httpConn = Deno.serveHttp(connection);

  (async () => {
    for await (const requestEvent of httpConn) {
      (async () => {
        try {
          await main.handle(requestEvent);
        } catch (e) {
          let httpError: HttpError;

          if (e instanceof HttpError) {
            httpError = e;
          } else {
            console.log(e);

            httpError = new HttpError(500);
          }

          await requestEvent.respondWith(
            new Response(httpError.message, {
              status: httpError.code,
            }),
          );
        }
      })();
    }
  })();
}
