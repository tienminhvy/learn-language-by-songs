# Plan: Remove Authentication Guard

**Status:** COMPLETED

**1. The current problem(s):**
When the user tries to download a song, the application responds with "Authentication token is missing or invalid". The application does not currently have a way to log in, so no token can be provided, blocking core functionality.

**2. The current implementation(s):**
The `SongsController` and `LyricsController` use `@UseGuards(JwtAuthGuard)` to protect their endpoints (such as `POST /api/songs/download`, `POST /api/lyrics/fetch/:songId`, and `POST /api/lyrics/translate`).

**3. The proposed architecture:**
We will temporarily bypass or remove the authentication requirement so that the user can download and interact with songs without logging in, as there is no login interface available yet. 

**4. The proposed implementation steps:**
1. Remove `@UseGuards(JwtAuthGuard)` and its import from `apps/backend/src/app/songs/songs.controller.ts`.
2. Remove `@UseGuards(JwtAuthGuard)` and its import from `apps/backend/src/app/lyrics/lyrics.controller.ts`.

**5. Potential risks, tradeoffs, and likely problems:**
- This opens up the API endpoints to anyone, meaning any user can trigger downloads or translations without being authenticated. Since this is an early prototype/development state without user login, this tradeoff is acceptable.

**6. Summarized code-change outline:**
- Modify `songs.controller.ts` to remove `JwtAuthGuard` decorator and import.
- Modify `lyrics.controller.ts` to remove `JwtAuthGuard` decorator and import.

**7. Expected affected files:**
- `apps/backend/src/app/songs/songs.controller.ts`
- `apps/backend/src/app/lyrics/lyrics.controller.ts`

**8. Git Strategy:**
- Branch: `fix/remove-auth-guard`
- Commit Message: `fix: remove authentication requirement for songs and lyrics endpoints`

**9. History Logging:**
- The plan will be logged to `docs_for_agents/impl_history/2026_04/remove-auth-guard.md`.