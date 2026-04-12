export interface HealthCheckItem {
  key: string;
  ok: boolean;
  detail: string;
}

export interface HealthSummary {
  status: "ok" | "warn" | "error";
  checks: HealthCheckItem[];
}

export function buildHealthSummary(options: {
  databaseOk: boolean;
  envIssues: string[];
  smsEnabled: boolean;
  hasCanonicalUrl: boolean;
  turnstileConfigured: boolean;
  cronConfigured: boolean;
  dbHardeningConfigured?: boolean;
}) {
  const checks: HealthCheckItem[] = [
    {
      key: "database",
      ok: options.databaseOk,
      detail: options.databaseOk ? "Database connection is healthy." : "Database connection failed.",
    },
    {
      key: "environment",
      ok: options.envIssues.length === 0,
      detail: options.envIssues.length === 0 ? "Environment configuration looks complete." : options.envIssues[0] ?? "Environment has warnings.",
    },
    {
      key: "canonical_url",
      ok: options.hasCanonicalUrl,
      detail: options.hasCanonicalUrl ? "Canonical URL is configured." : "Canonical URL is missing.",
    },
    {
      key: "bot_protection",
      ok: options.turnstileConfigured,
      detail: options.turnstileConfigured ? "Turnstile is configured." : "Turnstile is not configured.",
    },
    {
      key: "cron_secret",
      ok: options.cronConfigured,
      detail: options.cronConfigured ? "Cron secret is configured." : "Cron secret is not configured.",
    },
    {
      key: "db_hardening",
      ok: options.dbHardeningConfigured ?? false,
      detail:
        options.dbHardeningConfigured
          ? "Database hardening index is present."
          : "Database hardening index is missing.",
    },
    {
      key: "sms",
      ok: options.smsEnabled,
      detail: options.smsEnabled ? "SMS delivery is enabled." : "SMS delivery is disabled.",
    },
  ];

  const hasError = checks.some((check) => check.key === "database" && !check.ok);
  const hasWarning = checks.some((check) => !check.ok) || options.envIssues.length > 0;

  return {
    status: hasError ? "error" : hasWarning ? "warn" : "ok",
    checks,
  } satisfies HealthSummary;
}
