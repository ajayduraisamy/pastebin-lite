import { redis } from "@/lib/redis";
import { now } from "@/lib/time";
import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
 
  const { id } = await params;

  const key = `paste:${id}`;
  const paste = await redis.hgetall<any>(key);

  // Paste not found
  if (!paste || !paste.content) {
    notFound();
  }

  const currentTime = now();

  // TTL check
  if (paste.ttl_seconds) {
    const expiresAt =
      Number(paste.created_at) + Number(paste.ttl_seconds) * 1000;

    if (currentTime > expiresAt) {
      notFound();
    }
  }

  // View limit check
  if (paste.max_views !== null && paste.max_views !== undefined) {
    if (Number(paste.views) >= Number(paste.max_views)) {
      notFound();
    }
  }

  return (
    <main
      style={{
        padding: "24px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Paste</h1>

    
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          backgroundColor: "#f4f4f4",
          padding: "16px",
          borderRadius: "6px",
          marginTop: "16px",
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}
