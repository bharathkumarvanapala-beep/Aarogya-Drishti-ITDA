-- Additive only: preserve all existing users and patient records.
ALTER TABLE user_accounts ADD COLUMN IF NOT EXISTS "mfaLastStep" BIGINT;
CREATE TABLE IF NOT EXISTS auth_attempts (
  key text PRIMARY KEY, attempts integer NOT NULL DEFAULT 0,
  window_start timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE user_accounts ADD COLUMN IF NOT EXISTS "mfaEnrollmentSecret" VARCHAR(128);
