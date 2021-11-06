import { MongoClient } from 'mongo';

const VERSION_PATH = `${Deno.cwd()}/app/deno-server/db/version`;

const client = new MongoClient();

await client.connect('mongodb://127.0.0.1:27017');

console.log('Connected to database');

const db = client.database('caster');

export interface Migration {
  up?(): unknown;
  down?(): unknown;
}

export async function migrate(version?: number) {
  let currentVersion: number;

  try {
    currentVersion = Number(await Deno.readTextFile(VERSION_PATH));
  } catch (e) {
    console.log(e);

    currentVersion = 0;
  }

  const { default: migrations } = await import('./migrations.ts');

  if (typeof version === 'undefined') {
    version = migrations.length;
  }

  console.log(`Migrating ${currentVersion} -> ${version}`);

  if (version === currentVersion) {
    return;
  }

  if (version > currentVersion) {
    for (let i = currentVersion; i < version; i++) {
      await migrations[i].up?.();
    }
  }

  for (let i = currentVersion - 1; i >= version; i--) {
    await migrations[i].down?.();
  }

  await Deno.writeTextFile(VERSION_PATH, String(version));
}

export default db;
