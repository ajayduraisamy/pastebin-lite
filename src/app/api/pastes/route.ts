import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { content, ttl_seconds, max_views } = body;

  // Validation
  if (typeof content !== "string" || content.trim().length === 0) {
    return Response.json(
      { error: "content must be a non-empty string" },
      { status: 400 }
    );
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return Response.json(
      { error: "ttl_seconds must be an integer >= 1" },
      { status: 400 }
    );
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return Response.json(
      { error: "max_views must be an integer >= 1" },
      { status: 400 }
    );
  }

  const id = nanoid(8);
  const now = Date.now();

  await redis.hset(`paste:${id}`, {
    content,
    created_at: now,
    ttl_seconds: ttl_seconds ?? null,
    max_views: max_views ?? null,
    views: 0,
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    `http://localhost:3000`;

  return Response.json({
    id,
    url: `${baseUrl}/p/${id}`,
  });
}
