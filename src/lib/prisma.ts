import { PrismaClient } from "@prisma/client";
import { getEnv } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const env = getEnv();

function normalizeRuntimeDatabaseUrl(databaseUrl: string) {
  try {
    const url = new URL(databaseUrl);
    const host = url.hostname.toLowerCase();
    const isManagedPostgres = host.includes("neon.tech") || host.includes("pooler.");
    const sslMode = url.searchParams.get("sslmode");
    const sslAccept = url.searchParams.get("sslaccept");

    if (isManagedPostgres && sslMode === "require" && !sslAccept) {
      url.searchParams.set("sslaccept", "accept_invalid_certs");
    }

    if (process.platform === "win32" && process.env.NODE_ENV !== "production") {
      const channelBinding = url.searchParams.get("channel_binding");

      if (channelBinding === "require") {
        url.searchParams.delete("channel_binding");
        url.searchParams.set("channel_binding", "disable");
      }
    }

    return url.toString();
  } catch {
    return databaseUrl;
  }
}

function getRuntimeDatabaseUrl() {
  return normalizeRuntimeDatabaseUrl(env.DATABASE_URL);
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getRuntimeDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
