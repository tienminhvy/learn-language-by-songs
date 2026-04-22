### Comprehensive Plan: Reorganization of `AGENTS.md` (Updated)

**1. The Current Problem(s)**
*   `AGENTS.md` contains vital rules for LLM agents, but the structure is loose and conversational.
*   The project requires highly specific Git branching, atomic committing, and strict anti-push constraints that are currently missing from the ruleset.
*   The instruction to "re-organize this file" is still present at the top.

**2. The Current Implementation(s)**
*   A single Markdown file (`AGENTS.md`) missing clear architectural boundaries for LLM parsing.
*   Missing strict Git formatting and pushing constraints.
*   The required `docs_for_agents` directory does not yet exist.

**3. The Proposed Architecture**
The `AGENTS.md` file will be restructured into distinct, tagged, and LLM-optimized sections. We will add a dedicated section for Git & Source Control operations.
The new structure will be:
*   **PROJECT CONTEXT & MANDATES**: Core goal (Learn languages by songs, focus: Japanese) and Top-Tier Privacy/Security mandates.
*   **AGENT WORKFLOW**: Step-by-step required sequence of actions (Pre-flight checks, Plan creation, Approval, Execution).
*   **PLAN FORMATTING REQUIREMENTS**: The strict 9-point ruleset for plans.
*   **GIT & SOURCE CONTROL RULES (NEW)**:
    *   Evaluating if a dedicated branch is needed vs. using an existing branch.
    *   Branch naming convention: `prefix/branch-name`.
    *   Strict enforcement of atomic commits.
    *   Strict commit message formatting.
    *   Absolute prohibition of unconfirmed pushes and direct pushes to `main`.
*   **EXECUTION RULES & SCOPE CONTROL**: Handling scope creep, missing context, and required reporting.
*   **CONSTRAINTS & ANTI-PATTERNS**: Clearly defined "Do Not" actions.
*   **DOCUMENTATION MAINTENANCE**: Rules for keeping `docs_for_agents` and future static docs up-to-date.

**4. The Proposed Implementation Steps**
1.  Create the `docs_for_agents/` and `docs_for_agents/impl_history/` directories.
2.  Rewrite `AGENTS.md` according to the Proposed Architecture, ensuring *all* original rules are preserved and your new Git rules are deeply integrated into the prompt requirements.
3.  Remove the "Please re-organize this file" instruction.
4.  Save this exact plan document into `docs_for_agents/impl_history/` once approved.

**5. Potential Risks, Tradeoffs, and Likely Problems**
*   **Risk**: If the rules are too dense, some LLM models might skip steps.
*   **Mitigation**: Use strong markdown headers, bold text, and specific keywords (like "CRITICAL" and "AT ALL COSTS") for the non-negotiable Git rules.

**6. Summarized Code-Change Outline**
*   **Create Directories**: `mkdir -p docs_for_agents/impl_history`
*   **Edit `AGENTS.md`**: Replace current content with the highly structured version, appending the new Git workflows:
    *   *Git Branch Check*: Verify if the task requires a new branch (`prefix/branch-name`) or if it should be committed to the current working branch.
    *   *Atomic Commits*: Force single-purpose commits.
    *   *Commit Formatting*: `prefix: commit title\n- explanation #1\n- explanation #2`
    *   *Push Limits*: Add "DO NOT push without confirmation AT ALL COSTS" and "DO NOT push directly to the main branch".

**7. Expected Affected Files**
*   `AGENTS.md` (Modified)
*   `docs_for_agents/` (Created)
*   `docs_for_agents/impl_history/` (Created)

**8. Suggested Git Branch**
*   Based on the new rule to evaluate branch usage, this is a foundational documentation change. I suggest creating a dedicated branch: `chore/reorganize-agents-md`.

**9. Save Plan Requirement**
*   If approved, I will save this plan as `docs_for_agents/impl_history/reorganize-agents-md-plan.md`.
