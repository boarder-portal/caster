import db, { Migration } from 'db';

interface UserSchema1 {
  login: string;
  password: string;
}

interface UserSchema2 {
  login: string;
  password: string;
  isLive: boolean;
  streamToken: string | null;
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
];

export default migrations;
