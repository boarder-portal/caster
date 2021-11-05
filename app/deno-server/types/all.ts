import {
  RouteParams as OakRouteParams,
  RouterMiddleware as OakRouterMiddleWare,
} from 'oak';
import { Session } from 'oak_sessions';

import { PrivateUser } from 'helpers/db.ts';

export interface RouterState {
  session: Session;
  user?: PrivateUser;
}

export type RouterMiddleware<RouteParams extends OakRouteParams = OakRouteParams> = OakRouterMiddleWare<RouteParams, RouterState>;

export * from '../../shared/types/index.ts';
