import { NextResponse } from "next/server";
import { buildApiHeaders, getRequestIdFromHeaders } from "@/lib/api-security";
import { prisma } from "@/lib/prisma";
import { getOptionalEnv } from "@/lib/env";
import { getDurationMs, logEvent } from "@/lib/observability";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestId = getRequestIdFromHeaders(request.headers);
  const startedAt = Date.now();

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

    return NextResponse.json(
      {
        ok: true,
        database: "up",
        smsEnabled: env.SMS_ENABLED === "true",
        appUrlConfigured: Boolean(env.NEXT_PUBLIC_APP_URL || env.NEXT_PUBLIC_SITE_URL || env.NEXTAUTH_URL),
        environment: process.env.NODE_ENV ?? "development",
        requestId,
        responseTimeMs: durationMs,
        timestamp: new Date().toISOString(),
      },
      {
        headers: buildApiHeaders(requestId, { "Server-Timing": `app;dur=${durationMs}` }),
      }
    );
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

    return NextResponse.json(
      {
        ok: false,
        database: "down",
        error: isProduction ? "Health check failed" : error instanceof Error ? error.message : "Unknown error",
        requestId,
        responseTimeMs: durationMs,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: buildApiHeaders(requestId, { "Server-Timing": `app;dur=${durationMs}` }),
      }
    );
  }
}
