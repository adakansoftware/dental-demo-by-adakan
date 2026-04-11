import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableSlots } from "@/lib/slots";
import { compareDateStrings, getTodayDateInTurkey } from "@/lib/date";
import { buildRequestFingerprintFromHeaders, enforceRateLimitByKey } from "@/lib/security";

export const dynamic = "force-dynamic";

const slotsQuerySchema = z.object({
  specialistId: z.string().trim().min(1).max(64),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export async function GET(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? "slots-api";
  const { searchParams } = new URL(request.url);
  const parsed = slotsQuerySchema.safeParse({
    specialistId: searchParams.get("specialistId"),
    date: searchParams.get("date"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "specialistId and date required" },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
          "X-Request-Id": requestId,
        },
      }
    );
  }

  if (compareDateStrings(parsed.data.date, getTodayDateInTurkey()) < 0) {
    return NextResponse.json(
      { error: "Past dates are not allowed" },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
          "X-Request-Id": requestId,
        },
      }
    );
  }

  const fingerprint = buildRequestFingerprintFromHeaders(request.headers);
  const allowed = enforceRateLimitByKey(
    {
      scope: "slots-api",
      limit: 60,
      windowMs: 60 * 1000,
    },
    fingerprint
  );

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": "60",
          "X-Request-Id": requestId,
        },
      }
    );
  }

  try {
    const slots = await getAvailableSlots(parsed.data.specialistId, parsed.data.date);
    return NextResponse.json(slots, {
      headers: {
        "Cache-Control": "no-store",
        Vary: "Origin",
        "X-Request-Id": requestId,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch slots" },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
          "X-Request-Id": requestId,
        },
      }
    );
  }
}
