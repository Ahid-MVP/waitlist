# Migrating from JSON File to PostgreSQL

If you have existing waitlist data in `waitlist.json`, here's how to migrate it to your Neon database.

## Step 1: Backup Your Data

1. Make sure you have a copy of `waitlist.json`
2. It should look like:
   ```json
   [
     {
       "email": "user@example.com",
       "brandName": "Brand Name",
       "timestamp": "2026-04-02T10:30:00.000Z",
       "id": "1234567890"
     }
   ]
   ```

## Step 2: Create Migration Script

Create `scripts/migrate-json-to-db.ts`:

```typescript
import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // Read the JSON file
  const filePath = path.join(process.cwd(), 'waitlist.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  console.log(`Found ${data.length} entries to migrate`);
  
  // Insert each entry
  for (const entry of data) {
    try {
      await sql`
        INSERT INTO waitlist (email, brand_name, created_at)
        VALUES (
          ${entry.email}, 
          ${entry.brandName || null}, 
          ${entry.timestamp}
        )
        ON CONFLICT (email, brand_name) DO NOTHING
      `;
      console.log(`✓ Migrated: ${entry.email}`);
    } catch (error) {
      console.error(`✗ Failed to migrate ${entry.email}:`, error);
    }
  }
  
  console.log('Migration complete!');
}

migrate().catch(console.error);
```

## Step 3: Run Migration

```bash
# Install ts-node if needed
npm install -D ts-node

# Run the migration
npx ts-node scripts/migrate-json-to-db.ts
```

## Step 4: Verify

Check your Neon database to ensure all entries were migrated:

```sql
SELECT COUNT(*) FROM waitlist;
SELECT * FROM waitlist ORDER BY created_at DESC LIMIT 10;
```

## Step 5: Archive Old File

Once verified, you can safely archive or delete `waitlist.json`:

```bash
# Archive
mv waitlist.json waitlist.json.backup

# Or delete
rm waitlist.json
```

## Quick SQL Import (Alternative)

If you prefer pure SQL, convert your JSON manually:

```sql
INSERT INTO waitlist (email, brand_name, created_at) VALUES
  ('user1@example.com', 'Brand 1', '2026-04-01T10:00:00Z'),
  ('user2@example.com', NULL, '2026-04-01T11:00:00Z'),
  ('user3@example.com', 'Brand 2', '2026-04-01T12:00:00Z')
ON CONFLICT (email, brand_name) DO NOTHING;
```

Paste this directly into the Neon SQL Editor.
