import { readableStreamFromReader } from 'streams';

export function success(body: BodyInit, responseInit?: ResponseInit) {
  return new Response(body, {
    ...responseInit,
    status: 200,
  });
}

export function json(data: object) {
  return success(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function file(path: string) {
  const file = await Deno.open(path);

  return success(readableStreamFromReader(file));
}
