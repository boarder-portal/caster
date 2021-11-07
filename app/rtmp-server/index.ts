import { config } from 'dotenv';
import fetch from 'node-fetch';
import NodeMediaServer from 'node-media-server';
import path from 'path';

const { FFMPEG_PATH } = config().parsed ?? {};

const nms = new NodeMediaServer({
  rtmp: {
    port: 1935,
  },
  http: {
    port: 5391,
    mediaroot: path.resolve('./media').replace(/\\/g, '/'),
    // eslint-disable-next-line camelcase
    allow_origin: '*',
  },
  trans: {
    ffmpeg: FFMPEG_PATH,
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
      },
    ],
  },
});

nms.on('prePublish', async (id) => {
  const session = nms.getSession(id);

  if (!session) {
    return;
  }

  console.log('prePublish', session.id, session.publishStreamPath);

  try {
    const match = session.publishStreamPath.match(/^\/live\/(?<token>[a-z\d]{40})$/);

    if (!match) {
      throw new Error('wrong token');
    }

    const { status } = await fetch(`http://localhost:7766/api/stream/start/${match.groups?.token}`, {
      method: 'POST',
    });

    if (status !== 200) {
      throw new Error(`start not allowed (${status})`);
    }

    console.log('start allowed');
  } catch (e) {
    console.log(e);

    session.reject();
  }
});

nms.on('donePublish', async (id) => {
  const session = nms.getSession(id);

  if (!session) {
    return;
  }

  console.log('donePublish', session.id, session.publishStreamPath);

  try {
    const match = session.publishStreamPath.match(/^\/live\/(?<token>[a-z\d]{40})$/);

    if (!match) {
      throw new Error('wrong token');
    }

    await fetch(`http://localhost:7766/api/stream/end/${match.groups?.token}`, {
      method: 'POST',
    });
  } catch {}
});

nms.run();
