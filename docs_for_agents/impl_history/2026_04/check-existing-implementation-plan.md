# Implementation Plan: Enforce Existing Implementation Checks in AGENTS.md

**Status:** COMPLETED

**1. The current problem(s)**
The current `AGENTS.md` guidelines do not explicitly instruct agents to verify if the requested task or feature is already implemented in the codebase before formulating a comprehensive plan. This can lead to redundant work or overriding existing functionality.

**2. The current implementation(s)**
`AGENTS.md` has a "Step 1: Pre-flight Checks" section, but it only instructs the agent to check for the existence of the `docs_for_agents` directory and review documentation. It does not mandate codebase exploration for existing implementations.

**3. The proposed architecture**
We will amend the `AGENTS.md` file, specifically the "Step 1: Pre-flight Checks" section, to include a strict mandate. The agent must search the codebase for existing code that meets the requested task. If found, the agent must report this to the user and wait for further instructions rather than proceeding with a new plan or stopping completely.

**4. The proposed implementation steps**
1. Edit `AGENTS.md`.
2. Locate `### Step 1: Pre-flight Checks`.
3. Add a new bullet point explicitly instructing the agent to:
   - Search the codebase to check if an implementation already exists that meets the task's requirements.
   - If an existing implementation is found that meets the task, the agent MUST report this finding to the user and **WAIT for further instructions**, rather than proceeding with a new plan or stopping completely.
4. Save this approved plan to `docs_for_agents/impl_history/check-existing-implementation-plan.md`.

**5. Potential risks, tradeoffs, and likely problems**
- **Risk:** Agents might misinterpret what constitutes a "completed" implementation and prematurely stop planning.
- **Mitigation:** The instruction specifically requires the agent to "report and wait for further instruction," ensuring the user maintains control over the decision to proceed or modify the request.

**6. Summarized code-change outline**
- Update `AGENTS.md` under `### Step 1: Pre-flight Checks` to add the rule regarding checking for existing implementations and waiting for instruction.

**7. Expected affected files**
- `AGENTS.md`
- `docs_for_agents/impl_history/check-existing-implementation-plan.md` (new)

**8. Git Strategy**
- This is a minor documentation update to workflow rules. We can use a branch like `chore/update-agent-preflight-checks`.

**9. History Logging**
- Once this plan is approved and implemented, it will be saved to `docs_for_agents/impl_history/check-existing-implementation-plan.md` with its status updated to COMPLETED.