import "server-only";

import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

// Server-side image uploads to Supabase Storage. Uses the service-role key
// (never exposed to the client) and a public bucket; returns the public URL,
// which is what we store in imageUrl/avatarUrl columns.

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

function getSupabaseUrl(): string | undefined {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function uploadsConfigured(): boolean {
  return Boolean(getSupabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function uploadImage(opts: {
  data: ArrayBuffer;
  contentType: string;
  ext: string;
  folder?: string;
}): Promise<string> {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NOT_CONFIGURED");

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const folder = (opts.folder || "misc").replace(/[^a-z0-9-]/gi, "") || "misc";
  const path = `${folder}/${randomUUID()}.${opts.ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, opts.data, { contentType: opts.contentType, upsert: false });
  if (error) throw new Error(error.message);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
