import {
  RouteParams as OakRouteParams,
  RouterMiddleware as OakRouterMiddleWare,
} from 'oak';
import { Session } from 'oak_sessions';

import { ServerUser } from 'db';

export interface RouterState {
  session: Session;
  user?: ServerUser;
}

export type RouterMiddleware<RouteParams extends OakRouteParams = OakRouteParams> = OakRouterMiddleWare<RouteParams, RouterState>;

export * from '../../shared/types/index.ts';
