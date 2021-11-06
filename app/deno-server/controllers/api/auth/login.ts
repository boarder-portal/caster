import { compare } from 'bcrypt';
import { httpErrors } from 'oak';

import { RouterMiddleware } from 'types';

import { Validator } from 'helpers/Validator.ts';

import { User, getPublicUser } from 'db';

const validator: Validator<Body> = new Validator<Body>({
  login: /^[a-z\d_-]+$/,
  password: /^.*$/,
});

interface Body {
  login: string;
  password: string;
}

export const login: RouterMiddleware = async (ctx) => {
  const body = await ctx.request.body({ type: 'json' }).value;

  validator.check(body);

  const user = await User.findOne({
    login: body.login,
  });

  if (!user || !await compare(body.password, user.password)) {
    throw new httpErrors.BadRequest();
  }

  await ctx.state.session.set('userId', String(user._id));

  ctx.response.body = {
    user: getPublicUser(user),
  };
};
