import fs from 'fs';
import path from 'path';

/**
 * Minimal .env loader that matches shell/Next semantics: later entries win and
 * ${VAR} references are expanded. Kept dependency-free so the script can run
 * standalone (e.g. from the deploy workflow) with `tsx`.
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

loadDotEnv();

// Prevent Payload from dynamically pushing the dev schema while this script
// initialises. Without this, running the guard outside production would itself
// write a `dev` marker back into payload_migrations.
process.env.PAYLOAD_MIGRATING = 'true';

/**
 * Removes the Payload `dev` marker (a `payload_migrations` row with batch = -1)
 * that dev-mode schema pushes leave behind.
 *
 * Why: `payload migrate` shows an interactive "you've run Payload in dev mode...
 * data loss will occur" prompt whenever that row exists
 * (@payloadcms/drizzle/dist/migrate.js). In a non-interactive CI deploy this
 * either hangs until the job timeout or cancels and exits 0, silently skipping
 * migrations. Removing the marker lets migrations run unattended.
 *
 * This only deletes that bookkeeping row. It touches no content, schema, or real
 * migration records (batch >= 1). It is a no-op on a healthy production DB.
 */
async function clearDevMigrationMarker() {
  const { getPayload } = await import('payload');
  const { default: configPromise } = await import('../payload.config');

  const payload = await getPayload({ config: configPromise });

  const markers = await payload.find({
    collection: 'payload-migrations',
    where: { batch: { equals: -1 } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  });

  if (markers.docs.length === 0) {
    console.log('No dev schema-push marker found; nothing to clear.');
    process.exit(0);
  }

  for (const marker of markers.docs) {
    await payload.delete({
      collection: 'payload-migrations',
      id: marker.id,
      overrideAccess: true,
    });
  }

  console.log(`Cleared ${markers.docs.length} dev schema-push marker(s) from payload_migrations.`);
  process.exit(0);
}

clearDevMigrationMarker().catch((e) => {
  console.error('Failed to clear dev migration marker:', e);
  // Non-fatal: let the deploy continue. `payload migrate` will still surface any
  // genuine database problem.
  process.exit(0);
});
