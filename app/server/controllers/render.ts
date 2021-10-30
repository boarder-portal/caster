import fs from 'fs';
import path from 'path';

import { CustomMiddleware } from 'server/types/koa';

export const render: CustomMiddleware = async (ctx) => {
  ctx.res.setHeader('Content-Type', 'text/html');
  ctx.body = fs.createReadStream(path.resolve('./public/index.html'));
};
