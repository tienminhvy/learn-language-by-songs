# Plan: Fix Backend Video Downloading

**Status:** COMPLETED

**1. The current problem(s):**
The backend fails to download any video because `yt-dlp` and `ffmpeg` are missing or incompatible. The backend uses Alpine Linux (`node:22-alpine`) which relies on `musl libc`. As a result, the standalone `yt-dlp` binary downloaded from GitHub via `YTDlpWrap.downloadFromGithub` throws a `not found` error (as it is dynamically linked against `glibc`). Furthermore, `ffmpeg` is strictly required by `yt-dlp` to extract the audio to an `.mp3` file, but it is never installed in the Docker image.

**2. The current implementation(s):**
- `apps/backend/Dockerfile` uses `node:22-alpine` but does not install system dependencies like `ffmpeg` or `python3` (which is often needed for `yt-dlp`).
- `apps/backend/src/app/songs/songs.service.ts` attempts to download the Linux standalone `yt-dlp` binary from GitHub on module initialization. This fails to execute on the Alpine container.

**3. The proposed architecture:**
We will stop downloading the incompatible `yt-dlp` binary from GitHub. Instead, we will install `yt-dlp` and `ffmpeg` globally at the system level within the Dockerfile using Alpine's package manager (`apk`). The `SongsService` will then be updated to point to the system-provided `yt-dlp` executable.

**4. The proposed implementation steps:**
1. **Update `apps/backend/Dockerfile`:**
   - In the `base` stage, add the line `RUN apk add --no-cache ffmpeg python3 yt-dlp`. (If `yt-dlp` is unavailable directly via apk, we will fallback to using `pip`).
2. **Update `apps/backend/src/app/songs/songs.service.ts`:**
   - Remove the `YTDlpWrap.downloadFromGithub` logic and `fs.chmodSync` inside `onModuleInit`.
   - Instantiate `YTDlpWrap` using the system path directly: `this.ytDlp = new YTDlpWrap('yt-dlp');`.

**5. Potential risks, tradeoffs, and likely problems:**
- `apk add yt-dlp` relies on the Alpine community repositories. If there are package resolution issues in the version of Alpine being used, we may need to adjust the installation method to `apk add py3-pip && pip install yt-dlp --break-system-packages`. Using `apk` directly is preferred and is generally the most reliable method for Alpine.
- The size of the Docker image will increase slightly due to `ffmpeg` and Python dependencies, but this is unavoidable for audio extraction.

**6. Summarized code-change outline:**
- `apps/backend/Dockerfile`: Add `apk add --no-cache ffmpeg python3 yt-dlp`.
- `apps/backend/src/app/songs/songs.service.ts`: Simplify `onModuleInit` to point to the system `yt-dlp` binary and remove the GitHub binary download logic.

**7. Expected affected files:**
- `apps/backend/Dockerfile`
- `apps/backend/src/app/songs/songs.service.ts`

**8. Git Strategy:**
- We will execute these changes **ON THE CURRENT BRANCH** (`fix/remove-auth-guard`) as requested.
- We will use an atomic commit message: `fix: install system ffmpeg and yt-dlp to enable video downloading`

**9. History Logging:**
- This finalized plan is saved in `docs_for_agents/impl_history/2026_04/fix-backend-download.md`.