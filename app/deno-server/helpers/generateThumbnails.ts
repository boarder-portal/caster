import streams from 'helpers/streams.ts';
import { delay } from 'shared-helpers/delay.ts';

const DELAY = 15 * 1000;

export async function generateThumbnails(ffmpegPath: string) {
  while (true) {
    for (const stream of streams.getLiveStreams().values()) {
      const { login, streamToken } = stream.getUser();
      const process = Deno.run({
        cmd: [
          ffmpegPath,
          '-y',
          '-i', `http://localhost:5391/live/${streamToken}/index.m3u8`,
          '-ss', '00:00:01',
          '-vframes', '1',
          '-vf', 'scale=-2:300',
          `${Deno.cwd().replace(/\\/g, '/')}/public/thumbnails/${login}.png`,
        ],
        stdin: 'null',
        stdout: 'null',
        stderr: 'null',
      });

      await process.status();

      process.close();
    }

    await delay(DELAY);
  }
}
