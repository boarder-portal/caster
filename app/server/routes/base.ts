import mount from 'koa-mount';
import serve from 'koa-static';
import * as path from 'path';

import { get } from 'server/helpers/koa';

import { render } from 'server/controllers/render';

import app from 'server/app';

app.use(mount('/static', serve(path.resolve('./static'))));
app.use(mount('/public', serve(path.resolve('./public'))));

app.use(get(/^\/.*$/s, render));
