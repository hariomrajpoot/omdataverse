import { createClient } from "@supabase/supabase-js";

// Makes the storage bucket public so uploaded image URLs are viewable.
//   node --env-file=.env --import tsx scripts/make-bucket-public.ts

async function main() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = (process.env.SUPABASE_STORAGE_BUCKET || "uploads").trim();

  if (!url || !key) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { error } = await supabase.storage.updateBucket(bucket, { public: true });
  if (error) {
    console.error(`Failed to update bucket "${bucket}":`, error.message);
    process.exit(1);
  }
  console.log(`✔ Bucket "${bucket}" is now public — uploaded images will load.`);
}

main();
