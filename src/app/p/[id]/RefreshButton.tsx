"use client";

export default function RefreshButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer text-sm"
    >
      Refresh
    </button>
  );
}
