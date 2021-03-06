import { config } from 'dotenv';
import { Application } from 'oak';

import { generateThumbnails } from 'helpers/generateThumbnails.ts';
import streams from 'helpers/streams.ts';

import { error } from 'controllers/error.ts';
import mainRouter from 'routes/main.ts';

import { migrate, prepare } from 'db';

// await migrate(1);
await migrate();

console.log('Database migrated');

await prepare();

console.log('Database prepared');

await streams.loadLive();

console.log('Loaded live streams');

const { FFMPEG_PATH } = config({ safe: true });

generateThumbnails(FFMPEG_PATH);

const app = new Application();

app.use(error);
app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

app.listen({ port: 7766 });

console.log('Listening...');
