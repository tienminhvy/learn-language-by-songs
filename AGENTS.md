# AGENT GUIDELINES & WORKFLOW

This document outlines the mandatory procedures, architectural standards, and operational constraints for all LLM agents working on this repository.

---

## 1. PROJECT CONTEXT & CORE MANDATES

### Primary Goal
The goal of this repository is to help users learn any language they want through requested songs, primarily sourced from YouTube.
- **Current Focus:** Japanese.

### Privacy & Security
- **Top-Tier Security:** Privacy and security must be a primary consideration from the start of any implementation.
- **Data Protection:** Never expose or compromise user data or API keys.

---

## 2. MANDATORY AGENT WORKFLOW

When tasked with an action, the agent MUST follow these steps in order:

### Step 1: Pre-flight Checks
- Check for the existence of the `docs_for_agents` directory.
- Create `docs_for_agents` (and its subdirectories) if they do not exist.
- Review existing documentation in `docs_for_agents` to ensure information is up to date.

### Step 2: Comprehensive Planning
The agent MUST create a detailed plan for the requested task. The plan must achieve the project goals and follow the strict formatting rules below.

### Step 3: Explicit Approval
- **WAIT for explicit user instruction to proceed.**
- Do not implement the plan without clear confirmation, even if the environment allows it.

### Step 4: Execution & Atomic Commits
- Implement changes following the approved plan.
- Follow the strict Git & Source Control rules outlined in Section 4.

### Step 5: Reporting & Documentation
- Report any repo-specific problems (legacy constraints, hidden coupling, etc.).
- Update static documentation if needed (see Section 6).

---

## 3. PLAN FORMATTING REQUIREMENTS

Every plan must include, at minimum:
1. **The current problem(s):** Clear description of what needs to be fixed or added.
2. **The current implementation(s):** How it is currently handled.
3. **The proposed architecture:** High-level design of the solution.
4. **The proposed implementation steps:** Detailed sequence of actions.
5. **Potential risks, tradeoffs, and likely problems:** Honest assessment of the plan.
6. **Summarized code-change outline:** Brief overview of the code modifications.
7. **Expected affected files:** List of all files to be modified or created.
8. **Git Strategy:** Evaluation of whether a dedicated branch is needed or if an existing branch should be used. Branch names must follow `prefix/branch-name`.
9. **History Logging:** Instructions to save the approved plan in `docs_for_agents/impl_history`.

---

## 4. GIT & SOURCE CONTROL RULES

### Branching Strategy
- Before starting, evaluate if the task requires a dedicated branch.
- Branch naming convention: `prefix/branch-name` (e.g., `feat/add-lyrics-parser`, `fix/youtube-api-error`).

### Atomic Commits
- **Commits must be ATOMIC.** Each commit should represent a single, logical change.
- Do not bundle unrelated changes into a single commit.

### Commit Message Format
All commit messages MUST follow this exact format:
```
prefix: commit title
- commit explanation here #1
- commit explanation here #2
```

### Pushing Constraints (CRITICAL)
- **DO NOT push changes without explicit confirmation AT ALL COSTS.**
- **DO NOT push directly to the `main` branch.**

---

## 5. SCOPE CONTROL & REPORTING

### Scope Adherence
- Keep modifications scoped to the files discussed in the approved plan.
- If scope expansion is required:
    1. Clearly call out the expansion.
    2. Explain why additional files are affected.
    3. Report these files in the final summary.

### Mandatory Reporting
Agents must report material issues including:
- Legacy implementation constraints.
- Migration or state mismatches.
- Hidden coupling between backend/frontend/runtime paths.
- Permission or RBAC implications.
- Background task or database session issues.
- Documentation or history conflicts.

---

## 6. DOCUMENTATION MAINTENANCE

### Static Docs Updates
When adding or changing user-visible features, workflows, or UI:
- Review static in-app documentation under `frontend/src/docs/`.
- Update it so the `/docs` page remains aligned with the product.
- If no update is needed, state why in the final summary.

### docs_for_agents
- Keep the `docs_for_agents` directory updated with implementation history and architectural notes.

---

## 7. CONSTRAINTS & ANTI-PATTERNS (WHAT TO AVOID)

- **NO Unrequested Re-architecture:** Do not re-architect features without a specific request.
- **NO Weakening Security:** Never weaken role checks or security protocols.
- **NO Formatting Churn:** Avoid broad formatting-only changes.
- **NO Duplicate Helpers:** Do not add duplicate layers if one exists.
- **NO Speculative Cleanup:** Avoid "cleanup" in unrelated modules.
- **NO i18n Removal:** Never remove internationalization support from visible text.

---

## 8. HANDLING MISSING CONTEXT

If context is missing:
1. Inspect nearby modules first.
2. Follow existing project conventions.
3. Make the safest minimal assumption.
4. Call out uncertainty explicitly in the final summary.
