"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function createPaste() {
    setError("");
    setResultUrl("");
    setCopied(false);

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setLoading(true);

    const body: any = { content };
    if (ttl) body.ttl_seconds = Number(ttl);
    if (maxViews) body.max_views = Number(maxViews);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResultUrl(data.url);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(resultUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Pastebin Lite
        </h1>

        <textarea
          rows={8}
          placeholder="Enter your paste content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-3 mt-3">
          <input
            type="number"
            placeholder="TTL (seconds)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            className="w-1/2 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max views"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            className="w-1/2 border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={createPaste}
          disabled={loading}
          className={`mt-4 w-full flex justify-center items-center gap-2
            px-4 py-2 rounded-md text-white font-medium
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}
          `}
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>

        {error && (
          <p className="text-red-600 mt-3">{error}</p>
        )}

        {resultUrl && (
          <div className="mt-5 border-t pt-4">
            <p className="font-medium text-gray-700">Paste created:</p>

            <input
              value={resultUrl}
              readOnly
              className="w-full border rounded-md p-2 mt-2 bg-gray-50"
            />

            <div className="flex gap-3 mt-3">
              <button
                onClick={copyLink}
                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
              >
                {copied ? "Copied ✓" : "Copy Link"}
              </button>

              <a
                href={resultUrl}
                target="_blank"
                className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 cursor-pointer"
              >
                Visit
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
