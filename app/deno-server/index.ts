import { Application } from 'oak';

import { error } from 'controllers/error.ts';
import mainRouter from 'routes/main.ts';

import { User, migrate } from 'db';

await migrate();

console.log('Database migrated');

const app = new Application();

app.use(error);
app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

app.listen({ port: 7766 });

console.log('Listening...');
