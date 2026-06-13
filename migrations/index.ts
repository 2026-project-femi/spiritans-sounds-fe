import * as migration_20260611_105137 from './20260611_105137';
import * as migration_20260613_121734 from './20260613_121734';
import * as migration_20260613_publish_existing_docs from './20260613_publish_existing_docs';

export const migrations = [
  {
    up: migration_20260611_105137.up,
    down: migration_20260611_105137.down,
    name: '20260611_105137',
  },
  {
    up: migration_20260613_121734.up,
    down: migration_20260613_121734.down,
    name: '20260613_121734',
  },
  {
    up: migration_20260613_publish_existing_docs.up,
    down: migration_20260613_publish_existing_docs.down,
    name: '20260613_publish_existing_docs'
  },
];
