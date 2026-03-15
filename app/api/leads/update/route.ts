import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { sanityEnv } from "@/features/shared/lib/sanity/env";

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  const projectId = sanityEnv.projectId;
  const dataset = sanityEnv.dataset;
  const writeToken = process.env.SANITY_WRITE_TOKEN;

  if (!projectId || !dataset) {
    return NextResponse.json(
      { error: "Sanity configuration incomplete" },
      { status: 500 }
    );
  }

  if (!writeToken) {
    return NextResponse.json(
      { error: "Write token not configured" },
      { status: 500 }
    );
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: sanityEnv.apiVersion,
    token: writeToken,
    useCdn: false,
  });

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      );
    }

    const validStatuses = ["new", "contacted", "demo_scheduled", "proposal_sent", "converted", "lost"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const result = await client.patch(id).set({ status }).commit();

    return NextResponse.json({ success: true, lead: result });
  } catch (error) {
    console.error("Failed to update lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}