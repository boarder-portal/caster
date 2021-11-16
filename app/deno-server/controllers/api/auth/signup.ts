import { hash } from 'bcrypt';
import { InsertDocument } from 'mongo';
import { httpErrors } from 'oak';

import { RouterMiddleware } from 'types';

import { Validator } from 'helpers/Validator.ts';
import { generateStreamToken } from 'helpers/generateStreamToken.ts';

import { ServerUser, User, getPrivateUser } from 'db';

const validator: Validator<Body> = new Validator<Body>({
  login: /^[a-z\d_-]+$/,
  password: /^.+$/,
});

interface Body {
  login: string;
  password: string;
}

export const signup: RouterMiddleware = async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;

  validator.check(body);

  const existingUser = await User.findOne({
    login: body.login,
  });

  if (existingUser) {
    throw new httpErrors.Conflict();
  }

  const userInit: InsertDocument<ServerUser> = {
    login: body.login,
    password: await hash(body.password),
    isLive: false,
    streamToken: generateStreamToken(),
  };
  const userId = await User.insertOne(userInit);

  await ctx.state.session.set('userId', String(userId));

  ctx.response.body = {
    user: getPrivateUser({
      _id: userId,
      ...userInit,
    }),
  };
};
