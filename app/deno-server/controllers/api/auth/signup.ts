import { hash } from 'bcrypt';
import { httpErrors } from 'oak';

import { RouterMiddleware } from 'types/all.ts';

import { Validator } from 'helpers/Validator.ts';
import { User, getPublicUser } from 'helpers/db.ts';

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

  const userInit = {
    login: body.login,
    password: await hash(body.password),
  };
  const userId = await User.insertOne(userInit);

  await ctx.state.session.set('userId', String(userId));

  ctx.response.body = {
    user: getPublicUser({
      _id: userId,
      ...userInit,
    }),
  };
};
