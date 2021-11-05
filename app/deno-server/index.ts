import { Application } from 'oak';

import { error } from 'controllers/error.ts';
import mainRouter from 'routes/main.ts';

console.log('Start server');

const app = new Application();

console.log('Listening...');

app.use(error);
app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

app.listen({ port: 7766 });
