import { redis } from "@/lib/redis";
import { now } from "@/lib/time";
import { notFound } from "next/navigation";
import RefreshButton from "./RefreshButton";

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

  const currentTime = await now();


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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Paste
          </h1>

          <RefreshButton />
        </div>

        <pre className="whitespace-pre-wrap break-words bg-gray-100 p-4 rounded-md text-gray-800">
          {paste.content}
        </pre>
      </div>
    </main>
  );
}
