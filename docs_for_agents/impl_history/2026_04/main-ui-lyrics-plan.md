# Implementation Plan: Main UI & Synchronized Multi-Language Lyrics Player

**Status:** COMPLETED

## 1. The current problem(s)
Currently, the application lacks a user interface and backend logic to view, download, and play songs with synchronized lyrics. Additionally, it lacks a multi-layered lyrics parser capable of handling language-specific complexities (e.g., Furigana for Japanese, phonetic guides for others, and base translations for English/French/German). 

## 2. The current implementation(s)
The project is a fresh Nx workspace containing a NestJS backend (with Prisma) and an Angular 21 frontend. No lyrics fetching, YouTube downloading, or multi-language parsing features have been implemented yet.

## 3. The proposed architecture

### Backend (NestJS + Prisma)
- **Songs Module:** Handles YouTube downloads via a Node.js wrapper for `yt-dlp`. It saves video/audio streams and stores language-agnostic song metadata in the database.
- **Lyrics Module:** Searches and fetches synchronized `.lrc` lyrics from public APIs (e.g., LRCLIB) driven by the *actual song name*.
- **Multi-Language Parser Module:** A generic parsing interface that adapts based on the song's primary language:
  - *Japanese Focus:* Uses `kuroshiro` and `kuromoji.js` to parse lyrics into tokenized segments containing the base text (Kanji) and its reading (Furigana).
  - *Other Languages (English, French, German, etc.):* The parser passes the text through normally but can be extended in the future for language-specific phonetic guides (e.g., IPA symbols for French) if desired. For now, it leaves the "phonetic/reading" tier empty for non-Japanese languages.
- **Translation Module:** Provides scraped manual translations or allows users to manually submit/edit translations for each line in their preferred target language.

### Frontend (Angular 21 + TailwindCSS)
- **Mobile-First Layout:** Responsive container tailored for mobile touch interactions.
- **Song List View:** Displays available downloaded songs with options to play them in "Audio" or "Video" mode.
- **Synchronized Player View:** 
  - Contains an HTML5 `<audio>` or `<video>` element subscribing to the `timeupdate` event.
  - Renders a scrollable lyrics container that automatically shifts focus based on the current timestamp mapped to the parsed `.lrc` data.
  - The lyric line component is built to be **dynamic and adaptable**:
    1. **Phonetic/Reading Tier (Optional):** Shows Furigana for Japanese, or hides completely for languages like English/German.
    2. **Base Text Tier (Required):** The original language lyrics (Kanji+Kana, English words, French, etc.).
    3. **Translated Tier (Optional):** Translated version, togglable by the user.

## 4. Graphic Markdown Prototypes

**1. Song List View**
```text
+---------------------------------------+
|             My Songs           [+]    |
+---------------------------------------+
|  [Thumb] Yoru ni Kakeru (JA)          |
|          YOASOBI • 04:21              |
|          [▶ Video] [🎵 Audio]          |
+---------------------------------------+
|  [Thumb] Shape of You (EN)            |
|          Ed Sheeran • 03:53           |
|          [🎵 Audio]                   |
+---------------------------------------+
```

**2. Player & Synchronized Lyrics View (Japanese Example)**
```text
+---------------------------------------+
|  < Back     Now Playing       [Opts]  |
+---------------------------------------+
|                                       |
|     [ Album Art / Video Player ]      |
|                                       |
+---------------------------------------+
| Yoru ni Kakeru                        |
| YOASOBI                               |
| [==================o-------] 1:24/4:21|
|    [⏪]   [⏯ Play/Pause]   [⏩]       |
+---------------------------------------+
| [Toggle Translation: ON]              |
+---------------------------------------+
| (Scrolled past lyrics...)             |
|                                       |
|    しず        まち      よる         |  <-- 1. Phonetic (Furigana)
|  > 沈むように溶けてゆくように...      |  <-- 2. Base Text (Kanji+Kana)
|    As if sinking and melting away...  |  <-- 3. Translation
|                                       |
+---------------------------------------+
```

**3. Player & Synchronized Lyrics View (English Example)**
```text
+---------------------------------------+
|  < Back     Now Playing       [Opts]  |
+---------------------------------------+
|                                       |
| (Scrolled past lyrics...)             |
|                                       |
|  > I'm in love with the shape of you  |  <-- 2. Base Text
|    Estoy enamorado de tu forma...     |  <-- 3. Translation
|                                       |
|    We push and pull like a magnet do  |
|    Nos empujamos y atraemos...        |
+---------------------------------------+
```

## 5. The proposed implementation steps
1. **Database Schema Update:** Add `Song`, `Lyrics`, and `LyricLine` models. Ensure the `LyricLine` schema supports optional `phonetic` fields.
2. **Backend - Songs Service:** Implement `yt-dlp` download logic, tracking the language of the song metadata.
3. **Backend - Lyrics Service:** Fetch synchronized `.lrc` from LRCLIB based on explicit song names.
4. **Backend - Multi-Language Parser Service:** Implement a strategy pattern. Use `kuroshiro` for Japanese songs; return a simplified structure (base text only) for English/French/German.
5. **Backend - API Endpoints:** Expose REST endpoints for frontend consumption.
6. **Frontend - UI Shell:** Scaffold mobile-first layout in Angular.
7. **Frontend - Components:** Create `SongListComponent` and `PlayerComponent`.
8. **Frontend - Lyrics Sync Logic:** Implement `audio.currentTime` tracking and render dynamic tiers in `PlayerComponent` based on available parsed data (hiding the phonetic row if empty).

## 6. Potential risks, tradeoffs, and likely problems
- **Language Detection:** Automatically determining the song's language might be error-prone; we should allow manual override by the user.
- **NLP Library Compatibility:** `kuroshiro` and `kuromoji.js` might require specific Webpack/Node.js configurations.
- **LRCLIB Availability:** Missing songs will need manual fallback.

## 7. Summarized code-change outline
- Modify `apps/backend/prisma/schema.prisma` with language support.
- Add NestJS modules: `songs`, `lyrics`, `parser` (with strategy pattern).
- Add Angular components: `song-list`, `player`, `lyric-line`.
- Add routing to frontend `app.routes.ts`.

## 8. Expected affected files
- `apps/backend/prisma/schema.prisma`
- `apps/backend/src/app/songs/songs.module.ts`
- `apps/backend/src/app/lyrics/lyrics.module.ts`
- `apps/backend/src/app/parser/parser.module.ts` (with multi-language support)
- `apps/frontend/src/app/song-list/song-list.component.ts`
- `apps/frontend/src/app/player/player.component.ts`
- `apps/frontend/src/app/app.routes.ts`

## 9. Git Strategy
We will implement this in a dedicated feature branch: `feat/main-ui-lyrics-sync`. Commits will be atomic, separating backend architecture from frontend UI.

## 10. History Logging
Upon approval, this plan will be copied to `docs_for_agents/impl_history/2026_04/main-ui-lyrics-plan.md` and its status updated to COMPLETED once implemented.
