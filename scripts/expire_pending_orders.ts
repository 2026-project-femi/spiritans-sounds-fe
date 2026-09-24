import fs from 'fs';
import path from 'path';

/**
 * Minimal .env loader that matches shell/Next semantics: later entries win and
 * ${VAR} references are expanded. Kept dependency-free so the script can run
 * standalone (e.g. from cron) with `tsx`.
 */
function loadDotEnv() {
  const files = ['.env', '.env.local', '.env.production'];
  const store: Record<string, string> = {};

  for (const name of files) {
    const filePath = path.join(process.cwd(), name);
    if (!fs.existsSync(filePath)) continue;

    for (const rawLine of fs.readFileSync(filePath, 'utf8').split('\n')) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;

      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      value = value.replace(/\$\{([A-Za-z0-9_]+)\}/g, (_match, ref: string) => {
        return store[ref] ?? process.env[ref] ?? '';
      });
      store[key] = value;
    }
  }

  for (const [key, value] of Object.entries(store)) {
    process.env[key] = value;
  }
}

// Run BEFORE importing payload.config (imports are hoisted, so config is
// imported dynamically inside the main function).
loadDotEnv();

const TTL_HOURS = Number(process.env.PENDING_ORDER_TTL_HOURS || 24);

async function expirePendingOrders() {
  const { getPayload } = await import('payload');
  const { default: configPromise } = await import('../payload.config');

  const payload = await getPayload({ config: configPromise });
  const cutoff = new Date(Date.now() - TTL_HOURS * 60 * 60 * 1000).toISOString();

  const stale = await payload.find({
    collection: 'orders',
    where: {
      and: [{ status: { equals: 'pending' } }, { createdAt: { less_than: cutoff } }],
    },
    limit: 500,
    depth: 0,
  });

  if (stale.docs.length === 0) {
    console.log(`No stale pending orders older than ${TTL_HOURS}h.`);
    process.exit(0);
  }

  let expired = 0;
  for (const order of stale.docs) {
    try {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: { status: 'failed' },
      });
      expired++;
    } catch (e) {
      console.error(`Failed to expire order ${order.id}:`, e);
    }
  }

  console.log(
    `Expired ${expired}/${stale.docs.length} stale pending order(s) older than ${TTL_HOURS}h.`
  );
  process.exit(0);
}

expirePendingOrders().catch((e) => {
  console.error(e);
  process.exit(1);
});
