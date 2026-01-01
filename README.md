# Pastebin Lite

Pastebin Lite is a minimal Pastebin-like application that allows users to create text pastes and share a link to view them.
This project was built as part of a take-home assignment and is intended to pass automated grading tests.

---

## Deployed Application

Deployed URL:
https://pastebin-lite-sage.vercel.app

GitHub Repository:
https://github.com/ajayduraisamy/pastebin-lite

---

## Overview

This application allows users to create a text paste and receive a public URL that can be shared with others.
Pastes may optionally have constraints such as a time-to-live (TTL) or a maximum number of allowed views.
Once any constraint is triggered, the paste becomes unavailable.

---

## Technology Stack

Framework: Next.js (App Router, TypeScript)
Runtime: Node.js
Persistence: Upstash Redis
Styling: Tailwind CSS
Deployment: Vercel

---

## API Endpoints

Health Check
GET /api/healthz

Example response:
{ "ok": true }

---

Create a Paste
POST /api/pastes

Request body fields:
content – required, must be a non-empty string
ttl_seconds – optional, integer >= 1
max_views – optional, integer >= 1

A successful request returns a generated paste ID and a shareable URL pointing to /p/:id.
Invalid input returns a 4xx response with a JSON error message.

---

Fetch a Paste (API)
GET /api/pastes/:id

Successful response includes:
content
remaining_views (or null if unlimited)
expires_at (or null if no TTL)

Each successful API fetch counts as a view.
Unavailable pastes return HTTP 404.

---

View a Paste (HTML)
GET /p/:id

Returns an HTML page displaying the paste content safely.
If unavailable, HTTP 404 is returned.

---

## Deterministic Time Support

If TEST_MODE=1 is set, the request header:
x-test-now-ms

is treated as the current time for expiry checks.
Otherwise, system time is used.

---

## Persistence Layer

The application uses Upstash Redis.
Each paste is stored as a Redis hash containing:
content, created_at, ttl_seconds, max_views, views.

---

## Running Locally

1. Clone the repository
git clone https://github.com/ajayduraisamy/pastebin-lite.git
cd pastebin-lite

2. Install dependencies
pnpm install

3. Create .env.local
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
NEXT_PUBLIC_BASE_URL=http://localhost:3000

Optional:
TEST_MODE=1

4. Start server
pnpm dev

Open http://localhost:3000

---

## Status

All required routes implemented.
TTL and view limits enforced.
Deterministic testing supported.
Persistence verified.
Ready for grading.

---

Author
Ajay Duraisamy
