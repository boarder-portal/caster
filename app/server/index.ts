import config from 'shared/config';

import server from 'server/server';

import './routes';

(async () => {
  await new Promise((resolve) => {
    server.listen(config.port, () => {
      resolve(config.port);
    });
  });
})();
