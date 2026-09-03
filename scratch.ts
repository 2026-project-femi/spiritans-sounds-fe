import { getPayload } from 'payload';
import configPromise from '@/payload.config';

async function run() {
  const payload = await getPayload({ config: configPromise });
  const books = await payload.find({
    collection: 'publications',
    where: { _status: { equals: 'published' } }
  });
  console.log("Books:", books.docs.map(b => ({ id: b.id, title: b.title, isPreorder: b.isPreorder })));
}
run();
