import { Bson, MongoClient } from 'mongo';

import { PublicUser } from 'types/all.ts';

const client = new MongoClient();

await client.connect('mongodb://127.0.0.1:27017');

console.log('Connected to database');

const db = client.database('caster');

export interface PrivateUser {
  _id: Bson.ObjectId;
  login: string;
  password: string;
}

export const User = db.collection<PrivateUser>('users');

export function getPublicUser(user: PrivateUser | undefined): PublicUser | undefined {
  if (!user) {
    return;
  }

  return {
    _id: String(user._id),
    login: user.login,
  };
}

export default db;
