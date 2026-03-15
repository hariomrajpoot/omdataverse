import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { sanityEnv } from "@/features/shared/lib/sanity/env";

export const runtime = "nodejs";

export async function GET() {
  const projectId = sanityEnv.projectId;
  const dataset = sanityEnv.dataset;
  const readToken = process.env.SANITY_READ_TOKEN;

  if (!projectId || !dataset) {
    return NextResponse.json(
      { error: "Sanity configuration incomplete" },
      { status: 500 }
    );
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: sanityEnv.apiVersion,
    token: readToken,
    useCdn: false,
  });

  try {
    const leads = await client.fetch(`
      *[_type == "lead"] | order(createdAt desc) {
        _id,
        name,
        email,
        phone,
        company,
        service,
        message,
        type,
        status,
        demoDate,
        demoTime,
        useCase,
        createdAt
      }
    `);

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}