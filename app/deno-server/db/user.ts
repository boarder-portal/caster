import { Bson } from 'mongo';

import { PrivateUser, PublicUser } from 'types';

import db from './db.ts';

export interface ServerUser {
  _id: Bson.ObjectId;
  login: string;
  password: string;
  isLive: boolean;
  streamToken: string;
}

export const User = db.collection<ServerUser>('users');

export function getPrivateUser(user: ServerUser): PrivateUser {
  return {
    _id: String(user._id),
    login: user.login,
    isLive: user.isLive,
    streamToken: user.streamToken,
  };
}

export function getPublicUser(user: ServerUser): PublicUser {
  return {
    login: user.login,
    isLive: user.isLive,
  };
}
