import { Bson, Database, MongoClient } from 'mongo';

import { PublicUser } from 'types';

import db from './db.ts';

export interface PrivateUser {
  _id: Bson.ObjectId;
  login: string;
  password: string;
  isLive: boolean;
  streamToken: string | null;
}

export const User = db.collection<PrivateUser>('users');

export function getPublicUser(user: PrivateUser | undefined): PublicUser | undefined {
  if (!user) {
    return;
  }

  return {
    _id: String(user._id),
    login: user.login,
    isLive: user.isLive,
  };
}
