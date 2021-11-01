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

nms.on('prePublish', (id) => {
  const session = nms.getSession(id);

  if (!session) {
    return;
  }

  console.log('prePublish', session.id, session.publishStreamPath);
});

nms.run();
