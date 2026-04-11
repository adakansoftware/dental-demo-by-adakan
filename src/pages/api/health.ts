import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getOptionalEnv } from "@/lib/env";
import { getDurationMs, logEvent } from "@/lib/observability";

function buildRequestId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getRequestId(req: NextApiRequest) {
  const headerValue = typeof req.headers["x-request-id"] === "string" ? req.headers["x-request-id"].trim() : "";
  return /^[a-zA-Z0-9._:-]{8,120}$/.test(headerValue) ? headerValue : buildRequestId();
}

function applyApiHeaders(res: NextApiResponse, requestId: string, extras: Record<string, string> = {}) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Request-Id", requestId);

  for (const [key, value] of Object.entries(extras)) {
    res.setHeader(key, value);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestId = getRequestId(req);
  const startedAt = Date.now();

  if (req.method !== "GET") {
    applyApiHeaders(res, requestId, { Allow: "GET" });
    return res.status(405).json({ error: "Method Not Allowed", requestId });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    const env = getOptionalEnv();
    const durationMs = getDurationMs(startedAt);

    logEvent({
      event: "health_check_ok",
      requestId,
      route: "/api/health",
      meta: {
        durationMs,
        smsEnabled: env.SMS_ENABLED === "true",
        hasAppUrl: Boolean(env.NEXT_PUBLIC_APP_URL || env.NEXT_PUBLIC_SITE_URL || env.NEXTAUTH_URL),
      },
    });

    applyApiHeaders(res, requestId, { "Server-Timing": `app;dur=${durationMs}` });
    return res.status(200).json({
      ok: true,
      database: "up",
      smsEnabled: env.SMS_ENABLED === "true",
      appUrlConfigured: Boolean(env.NEXT_PUBLIC_APP_URL || env.NEXT_PUBLIC_SITE_URL || env.NEXTAUTH_URL),
      environment: process.env.NODE_ENV ?? "development",
      requestId,
      responseTimeMs: durationMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === "production";
    const durationMs = getDurationMs(startedAt);

    logEvent({
      level: "error",
      event: "health_check_failed",
      requestId,
      route: "/api/health",
      message: error instanceof Error ? error.message : "Unknown error",
      meta: { durationMs },
    });

    applyApiHeaders(res, requestId, { "Server-Timing": `app;dur=${durationMs}` });
    return res.status(500).json({
      ok: false,
      database: "down",
      error: isProduction ? "Health check failed" : error instanceof Error ? error.message : "Unknown error",
      requestId,
      responseTimeMs: durationMs,
      timestamp: new Date().toISOString(),
    });
  }
}
