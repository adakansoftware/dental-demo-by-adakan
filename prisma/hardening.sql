CREATE UNIQUE INDEX IF NOT EXISTS appointment_active_slot_unique
ON "Appointment" ("specialistId", "date", "startTime", "endTime")
WHERE status IN ('PENDING', 'CONFIRMED');

CREATE INDEX IF NOT EXISTS appointment_lookup_phone_date_idx
ON "Appointment" ("date", "patientPhone", "status");

CREATE INDEX IF NOT EXISTS appointment_lookup_specialist_date_idx
ON "Appointment" ("specialistId", "date", "status");
