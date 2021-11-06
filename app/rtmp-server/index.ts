import fetch from 'node-fetch';
import NodeMediaServer from 'node-media-server';

const nms = new NodeMediaServer({
  rtmp: {
    port: 1935,
  },
  http: {
    port: 5391,
    // eslint-disable-next-line camelcase
    allow_origin: '*',
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
