import { redis } from "@/lib/redis";
import { now } from "@/lib/time";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // await params
  const { id } = await context.params;
  const key = `paste:${id}`;

  // Fetch paste from Redis
  const paste = await redis.hgetall<any>(key);

  // Not found
  if (!paste || !paste.content) {
    return Response.json({ error: "Paste not found" }, { status: 404 });
  }

 const currentTime = await now();


  // TTL check
  if (paste.ttl_seconds) {
    const expiresAt =
      Number(paste.created_at) + Number(paste.ttl_seconds) * 1000;

    if (currentTime > expiresAt) {
      return Response.json({ error: "Paste expired" }, { status: 404 });
    }
  }

  // View limit check
  if (paste.max_views !== null && paste.max_views !== undefined) {
    if (Number(paste.views) >= Number(paste.max_views)) {
      return Response.json(
        { error: "View limit exceeded" },
        { status: 404 }
      );
    }
  }

  // Increment view count ONLY on success
  await redis.hincrby(key, "views", 1);

  const remainingViews =
    paste.max_views !== null && paste.max_views !== undefined
      ? Number(paste.max_views) - Number(paste.views) - 1
      : null;

  const expiresAtISO =
    paste.ttl_seconds !== null && paste.ttl_seconds !== undefined
      ? new Date(
          Number(paste.created_at) + Number(paste.ttl_seconds) * 1000
        ).toISOString()
      : null;

  return Response.json({
    content: paste.content,
    remaining_views: remainingViews,
    expires_at: expiresAtISO,
  });
}
