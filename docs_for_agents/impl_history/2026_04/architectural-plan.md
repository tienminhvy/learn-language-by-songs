# Implementation Plan: Architectural Design for Learn-Language-By-Songs (Angular Version)

**Status:** COMPLETED

**1. The current problem(s)**
The project lacks a defined architecture and tech stack. It needs to be a cross-platform PWA with a high focus on security and maintainability, specifically using Angular for the frontend.

**2. The current implementation(s)**
The project is currently empty except for core documentation (`README.md`, `AGENTS.md`).

**3. The proposed architecture**
A **Modular Monolith** using a **Full TypeScript** stack managed via **Nx (Monorepo tool)**. Nx is the industry standard for Angular projects and provides excellent integration with NestJS.

### Cross-Platform PWA Strategy
- **Frontend:** Angular (latest stable version) utilizing Standalone Components and Signals.
- **PWA Integration:** `@angular/pwa` package to handle service workers, manifest files, and offline capabilities.
- **Responsive UI:** Tailwind CSS integrated with Angular for a mobile-first design.

### Application Structure: Modular Monolith (via Nx)
- **Why?** Angular and NestJS are both modular by design. Using Nx allows us to share code (types, interfaces, validation logic) between the frontend and backend seamlessly.
- **Pros:** Shared libraries for business logic, unified testing, and a highly structured developer experience.

### Docker & Containerization Strategy
- **Development:** Use `docker-compose` to orchestrate the entire local environment, including the PostgreSQL database, the NestJS backend (with hot-reload), and the Angular frontend. This ensures "works on my machine" consistency.
- **Deployment:** 
    - **Frontend:** Multi-stage Docker build. Stage 1 builds the Angular app; Stage 2 serves it using a lightweight Nginx image configured for PWAs.
    - **Backend:** Multi-stage Docker build using a Node-Alpine base image for a minimal production footprint, ensuring only production dependencies are included.
- **Orchestration:** Docker-native environment variables and secrets management for security.

**4. Proposed Tech Stack**
- **Frontend:** Angular, TypeScript, Tailwind CSS, RxJS.
- **Backend:** NestJS (Node.js).
- **Monorepo Tool:** Nx.
- **Database:** PostgreSQL with Prisma ORM.
- **Containerization:** Docker & Docker Compose.
- **Authentication:** Passport.js with JWT.

**5. Security Prioritization (Pre-implementation)**
1. **Container Security:** Use non-root users inside Docker containers and scan images for vulnerabilities.
2. **Content Security Policy (CSP):** Configure strict CSP in Angular/Nginx to prevent XSS.
3. **CSRF Protection:** Implement secure JWT handling.
4. **Data Validation:** Use `class-validator` and `class-transformer` in NestJS.
5. **Secure API:** Implement `helmet` and rate limiting in NestJS.

**6. The proposed implementation steps**
1. **Initialize Nx Workspace:** Create a new Nx workspace containing an Angular app (`frontend`) and a NestJS app (`backend`).
2. **Dockerize Local Development:** Create a `docker-compose.yml` that mounts source code for hot-reloading and sets up the PostgreSQL container.
3. **Configure PWA:** Add `@angular/pwa` to the Angular application.
4. **Setup Database Layer:** Initialize Prisma in the backend and connect to the Dockerized PostgreSQL instance.
5. **Implement Production Dockerfiles:** Create multi-stage `Dockerfile`s for both frontend and backend.
6. **Implement Auth Module:** Create a shared `auth` library in Nx.
7. **Establish Security Middleware:** Configure Helmet, CORS, and Rate Limiting in NestJS.
8. **Verify PWA Compliance:** Use Lighthouse to verify the initial skeleton.

**7. Potential risks, tradeoffs, and likely problems**
- **Risk:** Docker overhead on local machines with limited resources.
- **Tradeoff:** Using Nx + Docker adds initial configuration complexity but guarantees high environmental consistency and deployment reliability.

**8. Summarized code-change outline**
- Initialize Nx workspace in the root.
- Generate Angular application.
- Generate NestJS application.
- Create `Dockerfile`s for `frontend` and `backend`.
- Setup root-level `docker-compose.yml` for dev and prod.

**9. Expected affected files**
- `package.json`
- `nx.json`
- `apps/frontend/` (new)
- `apps/backend/` (new)
- `libs/` (new shared libraries)
- `docker-compose.yml`

**10. Git Strategy**
- Branch: `feat/setup-nx-angular-nestjs-skeleton`

**11. History Logging**
- Save this plan to `docs_for_agents/impl_history/architectural-plan.md`.
