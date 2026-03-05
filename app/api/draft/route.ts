import { NextResponse } from "next/server";
import { draftMode } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  const enable = url.searchParams.get("enable");
  const redirectTo = url.searchParams.get("redirect") || "/";

  const expected = process.env.SANITY_PREVIEW_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: "Invalid secret." }, { status: 401 });
  }

  const dm = await draftMode();
  if (enable === "1") dm.enable();
  else dm.disable();

  return NextResponse.redirect(new URL(redirectTo, url.origin));
}

