# Additive Cloudflare Tunnel origin

This folder adds an origin server without changing existing application sources, configuration, database, encryption keys, or launchers. It serves the existing root dist build and forwards /api requests to the existing backend on 127.0.0.1:4100.

Start the existing PostgreSQL service and backend using their established configuration first. Then, from the project root, run:

    node deployment-cloudflare-20261109/origin.mjs

The origin listens only on http://127.0.0.1:3201. Configure an authenticated Cloudflare Tunnel to this address. Do not expose PostgreSQL or port 55432. No Cloudflare credential belongs in this folder or the frontend build.

The dist folder must already contain the intended application build. This server does not rebuild or overwrite it. It serves static files and HTML navigation routes, and streams API requests and responses, including authorization and cookies. WebSocket upgrades are not implemented; the current care API uses ordinary HTTP.

This is local-computer hosting through a tunnel: the computer, PostgreSQL, backend, origin server, and tunnel must remain running. It is not permanent managed hosting and does not move PostgreSQL to Cloudflare. A temporary tunnel address is not a stable production URL. Changing hostname also creates a different browser origin, so local browser sessions and unsynced offline records do not automatically move to it.

This is not a claim that the application is production-ready. Production MFA and cross-network video connectivity require separate validation/configuration. Test login portals, records, offline synchronization, photos, and calls through the final hostname before relying on public availability. Existing local application addresses continue to work independently.

Run isolated origin tests (uses a temporary fixture and fake backend; no real database writes):

    node --test deployment-cloudflare-20261109/origin.test.mjs
