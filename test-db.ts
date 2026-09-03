import { getPayload } from 'payload';
import configPromise from './payload.config';

async function run() {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'publications',
    limit: 10,
    depth: 1,
  });

  for (const doc of result.docs) {
    console.log(`Title: ${doc.title}`);
    console.log(`Slug: ${doc.slug}`);
    console.log(`_status: ${doc._status}`);
    console.log(`isPreorder: ${doc.isPreorder}`);
    console.log('---');
  }
}

run().catch(console.error).finally(() => process.exit(0));
