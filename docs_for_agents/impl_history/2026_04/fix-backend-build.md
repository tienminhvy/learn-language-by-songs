# Plan: Fix Backend Build Errors

## 1. Status
**COMPLETED**

## 2. The Current Problem(s)
The `lls-backend` fails to build due to the following errors:
1. Syntax errors in `apps/backend/src/app/app.module.ts` caused by an invalid literal `...`.
2. TypeScript errors regarding the `PrismaService` not finding properties like `song`, `lyrics`, `lyricLine` (TS2339).
3. TypeScript errors complaining about missing modules or type declarations for `kuroshiro`, `kuroshiro-analyzer-kuromoji`, `yt-dlp-wrap`, and `@nestjs/serve-static` (TS2307).

## 3. The Current Implementation(s)
- `app.module.ts` contains `...` where configuration objects should be, likely a result of incomplete file editing.
- The Prisma client is either outdated relative to the newly added models in `schema.prisma` or has not been generated locally.
- Several third-party libraries lack corresponding `@types/*` packages and have not been declared in a `.d.ts` file.

## 4. The Proposed Architecture
- Rectify syntax issues in `app.module.ts` by explicitly providing valid configuration.
- Generate the Prisma Client to sync type definitions with the database schema.
- Introduce an ambient type declaration file (`types.d.ts`) for untyped modules to satisfy the TypeScript compiler.
- Ensure all node modules are properly installed.

## 5. The Proposed Implementation Steps
1. **Update `AGENTS.md` Policy:**
   - Add a strict rule to `AGENTS.md` under "CONSTRAINTS & ANTI-PATTERNS" explicitly prohibiting the use of omission placeholders like `...` or `// rest of code` in source code files, ensuring code modifications are always complete.
2. **Fix `app.module.ts` Syntax:** 
   - Edit `apps/backend/src/app/app.module.ts` to replace the `...` with valid `ThrottlerModule` configuration.
3. **Generate Prisma Client:**
   - Execute `npx prisma generate --schema=apps/backend/prisma/schema.prisma` to produce updated typings.
4. **Declare Module Types:**
   - Create `apps/backend/src/types.d.ts` and add module declarations.
5. **Update Services for Type Safety:**
   - Update `parser.service.ts` and `songs.service.ts` to use `any` for untyped classes to avoid TS2749/TS2709 errors.
6. **Install Dependencies:**
   - Run `npm install` to ensure missing packages like `@nestjs/serve-static` are correctly linked.
7. **Save Plan to Implementation History:**
   - Write this approved plan (marked as COMPLETED) to `docs_for_agents/impl_history/2026_04/fix-backend-build.md`.

## 6. Potential Risks, Tradeoffs, and Likely Problems
- By declaring untyped libraries as `any`, we lose TypeScript's static typing benefits for these libraries.
- Permissions issues with `dist` directory (owned by root) might cause NX to fail even if compilation succeeds.

## 7. Summarized Code-Change Outline
- Updated `AGENTS.md` with strict code completeness rules.
- Fixed syntax in `app.module.ts`.
- Created `apps/backend/src/types.d.ts`.
- Updated `parser.service.ts` and `songs.service.ts` to use `any` types for third-party libraries.
- Regenerated Prisma Client.

## 8. Expected Affected Files
- `AGENTS.md`
- `apps/backend/src/app/app.module.ts`
- `apps/backend/src/types.d.ts` (new)
- `apps/backend/src/app/parser/parser.service.ts`
- `apps/backend/src/app/songs/songs.service.ts`
- `docs_for_agents/impl_history/2026_04/fix-backend-build.md` (new)

## 9. Git Strategy
We executed these fixes directly on the current branch.

## 10. History Logging
The plan is now marked as COMPLETED and saved to implementation history.
