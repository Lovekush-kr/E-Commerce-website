# AI Coding Agent Rules

## 1. Read before changing code
At the beginning of every session:
1. Read `agent/context/handoff.md`.
2. Read `agent/context/current-state.md`.
3. Read these rules.
4. Read the relevant parts of `design-tokens.md` and `tech-stack.md`.
5. Inspect the actual source files related to the task.

Do not rely on memory or old notes when actual code can be checked.

## 2. Project scope
- Build the Task 04 e-commerce frontend described in the context files.
- Use the existing React + Vite setup where possible.
- Do not recreate the project or replace working files without a clear reason.
- Work only on the current phase unless the user explicitly requests a wider change.
- Keep the implementation at beginner-to-intermediate React level.

## 3. Approved React level
Prefer functional components, props, JSX, `useState`, `useEffect`, `useContext`, Context API, React Router, controlled forms, conditional rendering, and common array methods.

Avoid Redux, advanced state-management libraries, React Query/SWR, complex custom-hook systems, state machines, higher-order components, render-prop patterns, advanced memoization, concurrent React APIs, and elaborate abstractions unless a real requirement makes them necessary. If a simple solution and an advanced solution both work, choose the simple one.

## 4. Design rules
- Follow `agent/context/design-tokens.md`.
- Preserve Tyrian purple `#66023C` and ruby `#E0115F`.
- Use near-black, dark plum, and muted magenta as supporting colors.
- Keep typography readable and contrast adequate.
- Use the abstract background sparingly and provide a fallback.
- Build mobile, tablet, and desktop layouts deliberately.
- Use semantic HTML, keyboard-accessible controls, and visible focus states.

## 5. Code quality
- Prefer clear, reusable components with one main responsibility.
- Avoid duplicated JSX, CSS, fetch logic, and business rules.
- Do not create unnecessary files, wrappers, packages, abstractions, or state.
- Avoid unnecessary `useEffect`, `useMemo`, and `useCallback`.
- Derive totals, counts, filtering, and sorting when practical rather than storing duplicate values.
- Preserve working behavior.
- Do not perform unrelated refactors.
- Remove unused imports/variables introduced by your changes.
- Keep code readable for an intermediate React student.
- Make every visible control work, or clearly label it as unavailable/demo.

## 6. API and data rules
- Verify DummyJSON endpoints and actual response fields before relying on them.
- Centralize API requests.
- Handle loading, error, empty, and retry states.
- Avoid repeated per-card requests.
- Use stable product IDs as keys.
- Never fabricate API fields or present demo content as verified facts.
- Do not expose secrets in frontend code.
- Keep the site usable and explain limitations if the network/API fails.

## 7. Phase-based workflow
Implement the phases in `current-state.md` in order. For each phase:
1. Identify the acceptance criteria.
2. Inspect only the relevant existing code.
3. Make the smallest coherent set of changes.
4. Verify the changed behavior.
5. Run available lint/build checks at suitable milestones.
6. Update `current-state.md` and `handoff.md`.
7. Stop after the approved phase unless asked to continue.

Do not claim completion until the phase acceptance criteria are met.

## 8. Testing and truthful reporting
- Inspect `package.json` to learn available scripts.
- Test changed flows when practical.
- Run the production build at phase boundaries or when asked.
- Record actual commands and results.
- Never say tests, builds, or manual checks passed unless they were actually performed.
- If a command cannot run, record the reason.
- Do not claim a file was saved or changed unless the environment confirms it.

## 9. Session recovery
When a new session begins:
1. Read `handoff.md` and `current-state.md`.
2. Read relevant design/stack/rule guidance.
3. Inspect actual files for the unfinished task.
4. Reconcile notes with code.
5. Find the first incomplete acceptance criterion.
6. Continue from there without rebuilding completed features.
7. Update both state and handoff after progress.

If work is interrupted mid-change, document which files may be incomplete and what to inspect first.

## 10. Credit-efficient communication
- Keep progress updates concise.
- Do not restate the whole project at every turn.
- Do not print large files into chat when direct edits are possible.
- Avoid unnecessary repeated scans and broad refactors.
- Make one well-defined task per work session.
- Before stopping, record the exact next action, not “continue later.”

## 11. Blockers and questions
If a genuine blocker exists, explain it briefly and document it in the handoff. Otherwise make a reasonable, low-risk decision and record it. Ask only concise questions that materially affect implementation.

## 12. Completion criteria
A feature is complete only when its required behavior is implemented and reasonably verified. Keep the status notes accurate. At the end of each phase, list acceptance criteria met, checks run, remaining issues, and the next exact task.
