# Free synthetic demonstration backend

This additive package hosts the existing Node backend on a Render Free web service and stores synthetic demonstration records in a new Neon PostgreSQL database. Existing local files, databases, keys, services, and features are not migrated or overwritten. Cloudflare frontend hosting and its API proxy are configured separately.

This is a demonstration, not full production hosting. Render Free services can sleep and have usage limits. Keep spending limits at zero, select only Free plans, and do not enable paid upgrades. No continuous-availability promise is made. See [Render free-service limitations](https://render.com/docs/free) and [Blueprint settings](https://render.com/docs/blueprint-spec).

## Required settings

Create a separate empty Neon database named `aarogya_demo_<chosen_name>` in a dedicated demonstration project. Do not use an existing database. Set `DATABASE_URL` from Neon's connection dialog, including `sslmode=require` (or `verify-full`). Use its direct endpoint for the one-time initialization. The initializer refuses any existing application tables, views, or sequences, even from a previous unsuccessful attempt. See [Neon connection instructions](https://neon.com/docs/connect/connect-from-any-app).

Store the following secrets in Render's environment settings, never in Git, the frontend, or screenshots:

- `DATABASE_URL`: dedicated Neon connection string.
- `CARE_KEY_BASE64`: exactly 32 cryptographically random bytes encoded as base64. Keep this same value across restarts and redeployments; losing it makes existing encrypted case records unreadable.
- `JWT_SECRET` and `JWT_REFRESH_SECRET`: two different cryptographically random values, each 32–64 bytes encoded as hexadecimal.
- `CORS_ORIGIN`: exact Cloudflare frontend HTTPS origin, without a trailing slash.
- `DEMO_ONLY=true`: explicit synthetic-only configuration. Render supplies `PORT`.

The runtime materializes the stable encryption key into a fresh private ephemeral directory before loading the backend. It uses an empty working directory so it cannot read the original backend `.env`. A database marker binds this demo to the configured key fingerprint. Startup refuses an uninitialized database or mismatched key. It never pushes schemas or seeds records automatically.

## One-time initialization

The repository must already have backend dependencies installed, Prisma generated, and the backend built. The initializer additionally requires `INIT_EMPTY_DEMO_DATABASE=yes` in that command's environment. Run explicitly from a trusted machine with the dedicated Neon settings loaded:

```text
node deploy/free-demo/init-empty-db.cjs
```

It checks emptiness, takes an initialization lock, runs Prisma schema creation only against the validated dedicated Neon URL, seeds seven synthetic accounts from the existing synthetic-only seed module, then writes the demo/key marker. It does not read or migrate patient records. It does not accept data-loss flags. If initialization fails after creating objects, investigate that fresh database; do not bypass the empty-database guard or apply it to an existing database. Never run general Prisma `db push` against the initialized demo: its separate safety marker is intentionally outside the application schema.

## Render service

Select the repository and use this folder's `render.yaml` as the Blueprint path where supported, or copy its values into a new Free Node web service. Repository root must be the service working directory; do not set rootDir to this folder. Use a new service name to avoid modifying any existing service. Build installs only backend dependencies, generates Prisma, and compiles Nest. Start runs `node deploy/free-demo/start.cjs`. No paid pre-deploy command, persistent disk, Render PostgreSQL instance, or scheduled job is required. Initialize Neon separately before starting the service. Automatic deployments are disabled in the template.

## Functional limitations and checks

The active care workflow uses PostgreSQL and existing local image processing. The older S3, OpenCV, AI, and Redis-dependent auxiliary services are intentionally disconnected from existing local endpoints. They are not provided by this package. Video still lacks a TURN relay, so calls across some networks may fail. Demonstration MFA requires development mode and is not production authentication. Browser offline data remains tied to each frontend origin and does not move from localhost automatically. Free-service wakeup delays may require retrying the first request.

Only synthetic records may be entered. Do not claim all application features are permanently hosted until the missing services and complete hosted workflow have been separately tested. Validate all seven portal logins, access controls, registration, photographs, offline sync, reviews, referrals, appointments, reports, and video through the final Cloudflare URL.

Run local guard tests without any database connection:

```text
node --test deploy/free-demo/config.test.cjs
```
