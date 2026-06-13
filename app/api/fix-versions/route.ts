import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const payload = await getPayload({ config: configPromise });
  const collections = ['article', 'homily', 'prayer', 'music', 'events', 'magazineIssues', 'publications'] as const;
  
  const results: Record<string, number> = {};

  for (const collection of collections) {
    try {
      const docs = await payload.find({
        collection: collection as any,
        limit: 1000,
        depth: 0,
        draft: false, // Ensures we query the main table where they exist
      });
      
      let updatedCount = 0;
      for (const doc of docs.docs) {
        // Calling update triggers the Payload versions hook, creating the _versions row automatically!
        await payload.update({
          collection: collection as any,
          id: doc.id,
          data: {
             _status: 'published' // explicitly re-save as published
          },
          // Avoid validation errors on older docs
          overrideAccess: true,
          req: {
            user: { role: 'admin' }
          } as any,
        });
        updatedCount++;
      }
      results[collection] = updatedCount;
    } catch (e: any) {
      console.error(`Error migrating ${collection}:`, e.message);
      results[collection] = -1; // Indicate error
    }
  }

  return NextResponse.json({ success: true, migrated: results });
}
