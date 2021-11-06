import { Bson } from 'mongo';

import { generateStreamToken } from 'helpers/generateStreamToken.ts';

import db, { Migration } from 'db';

interface UserSchema1 {
  _id: Bson.ObjectId;
  login: string;
  password: string;
}

interface UserSchema2 {
  _id: Bson.ObjectId;
  login: string;
  password: string;
  isLive: boolean;
  streamToken: string | null;
}

interface UserSchema3 {
  _id: Bson.ObjectId;
  login: string;
  password: string;
  isLive: boolean;
  streamToken: string;
}

const migrations: Migration[] = [
  {
    async down() {
      const User = db.collection<UserSchema1>('users');

      await User.drop();
    },
  },
  {
    async up() {
      const User = db.collection<UserSchema1>('users');

      await User.updateMany({}, {
        $set: {
          isLive: false,
          streamToken: null,
        },
      });
    },
    async down() {
      const User = db.collection<UserSchema2>('users');

      await User.updateMany({}, {
        $unset: {
          isLive: true,
          streamToken: null,
        },
      });
    },
  },
  {
    async up() {
      const User = db.collection<UserSchema2>('users');

      const users = await User.find().toArray();

      for (const user of users) {
        if (!user.streamToken) {
          await User.updateOne(
            { _id: user._id },
            { $set: { streamToken: generateStreamToken() } },
          );
        }
      }
    },
  },
];

export default migrations;
