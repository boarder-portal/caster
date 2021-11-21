import { Session, RedisStore } from 'oak_sessions';
import { connect } from 'redis';

const redis = await connect({
  hostname: '127.0.0.1',
  port: 6379,
});

const expires = new Date(Date.UTC(2038, 0));

const store = new RedisStore(redis, 'caster_session_');
const session = new Session(store, {
  expireAfterSeconds: Math.round((Number(expires) - Number(new Date())) / 1000),
  cookieSetOptions: {
    expires,
  },
});

export default session;
