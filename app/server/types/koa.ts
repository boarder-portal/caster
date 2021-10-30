import { Middleware, ParameterizedContext } from 'koa';

import { Dictionary } from 'shared/types';

export interface CustomState {
  urlIndexGroups: string[];
  urlKeyGroups?: Dictionary<string>;
}

export type CustomContext = ParameterizedContext<CustomState, {}>;

export type CustomMiddleware = Middleware<CustomState, CustomContext>;

