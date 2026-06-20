import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { uploadImage, uploadsConfigured } from "@/lib/supabase-storage";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

// Authenticated image upload → returns a public URL to store in a field.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Please sign in." }, { status: 401 });
  }
  if (!uploadsConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Image uploads aren't configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, and create a public Storage bucket.",
      },
      { status: 500 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  const folder = (form.get("folder") as string | null) ?? "misc";

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Image must be under 5 MB." }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { ok: false, error: "Unsupported type. Use PNG, JPG, WEBP, GIF, or SVG." },
      { status: 400 },
    );
  }

  try {
    const data = await file.arrayBuffer();
    const url = await uploadImage({ data, contentType: file.type, ext, folder });
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "NOT_CONFIGURED") {
      return NextResponse.json({ ok: false, error: "Image uploads aren't configured." }, { status: 500 });
    }
    if (/row-level security|not authorized|403/i.test(msg)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Storage denied the upload. SUPABASE_SERVICE_ROLE_KEY must be the secret/service_role key (sb_secret_… or the legacy eyJ… service_role), not the publishable/anon key.",
        },
        { status: 500 },
      );
    }
    if (/bucket not found/i.test(msg)) {
      return NextResponse.json(
        { ok: false, error: "Storage bucket not found — create it and match SUPABASE_STORAGE_BUCKET." },
        { status: 500 },
      );
    }
    console.error("Upload error:", err);
    return NextResponse.json({ ok: false, error: "Upload failed." }, { status: 500 });
  }
}
