# Plan: Fix Docker Compose DB Migration Issue

**Status:** COMPLETED

**1. The current problem(s):**
When running `docker compose up`, the backend throws a `PrismaClientKnownRequestError` because `The table 'public.Song' does not exist in the current database.` This is caused by two things: 
- The database schema is empty because no Prisma migrations are run on container startup.
- There is a race condition where the backend starts trying to read from the database before PostgreSQL is fully initialized and ready to accept connections.

**2. The current implementation(s):**
- `docker-compose.yml` uses `depends_on: - db` for the backend, which only waits for the container process to start, not for PostgreSQL to actually be ready.
- `apps/backend/Dockerfile` in the `development` stage generates the Prisma client and immediately runs `npx nx serve backend` without migrating the database.

**3. The proposed architecture:**
We will configure Docker Compose to correctly wait for the database using a healthcheck and update the Dockerfile's CMD to apply the existing database migrations prior to launching the application.

**4. The proposed implementation steps:**
1. Update `docker-compose.yml`:
   - Add a `healthcheck` configuration for the `db` service using `pg_isready -U ${DB_USER} -d ${DB_NAME}`.
   - Change the `depends_on` definition for `backend` to wait for the `db` service to be `service_healthy`.
2. Update `apps/backend/Dockerfile`:
   - In the `development` stage, change `CMD ["npx", "nx", "serve", "backend", "--host=0.0.0.0"]` to `CMD ["sh", "-c", "npx prisma migrate deploy --schema apps/backend/prisma/schema.prisma && npx nx serve backend --host=0.0.0.0"]`. This ensures migrations run before the server starts.

**5. Potential risks, tradeoffs, and likely problems:**
- If a database migration fails or takes too long, the backend container will crash or loop. However, this is standard/expected behavior for a failing DB migration.
- Container startup will be slightly delayed while waiting for the healthcheck, but it fixes the critical race condition.

**6. Summarized code-change outline:**
- Add `healthcheck` to `docker-compose.yml` (db service) and update backend's `depends_on` to `condition: service_healthy`.
- Prepend `npx prisma migrate deploy` in the `CMD` for the `development` stage of `apps/backend/Dockerfile`.

**7. Expected affected files:**
- `docker-compose.yml`
- `apps/backend/Dockerfile`

**8. Git Strategy:**
- Branch: `fix/docker-compose-db-migration`
- We will commit the changes as an atomic fix: `fix: resolve docker-compose backend database connection and migration errors`.

**9. History Logging:**
- The finalized plan will be copied to `docs_for_agents/impl_history/2026_04/fix-docker-compose-db.md` once completed.