import "server-only";

import { draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";
import { getSanityClient } from "@/lib/sanity/client";

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number;
}): Promise<T> {
  const preview = (await draftMode()).isEnabled;
  const client = getSanityClient({ preview });

  return client.fetch(query, params, {
    next: { revalidate },
    cache: preview ? "no-store" : "force-cache",
  });
}

