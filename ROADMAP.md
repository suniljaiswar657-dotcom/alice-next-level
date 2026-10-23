# Alice Next Level — Roadmap

## Goal
Build a practical, mobile-first personal AI assistant with memory retrieval, project isolation, and carefully controlled tool execution.

## Milestone 1 — Memory Notebook
- [x] Add a mobile-first interface.
- [x] Save, search, edit, and delete individual memories.
- [x] Export and import a JSON backup.
- [x] Keep memory data in browser local storage for this first version.
- [ ] Test on Android in a browser.
- [ ] Publish a live preview only after the owner approves the hosting provider.

## Milestone 2 — Project Spaces
- Separate memory by project.
- Add project-specific instructions and progress.
- Never combine project data unless explicitly requested.
- Preserve existing project files; ask before destructive changes.

## Milestone 3 — Retrieval
- Search saved notes by keywords and tags.
- Return relevant snippets with their source and timestamp.
- Distinguish saved facts from assumptions and unknowns.
- Do not claim to have read conversations or files that were not accessible.

## Milestone 4 — AI connection
- Choose an AI provider and architecture before implementation.
- Never place API secrets in public client-side code or a public repository.
- Use a backend or serverless function to protect credentials.
- Explain possible usage costs before enabling paid services.

## Milestone 5 — Controlled actions
- Require approval before consequential or destructive actions.
- Keep an audit trail for completed actions.
- Verify outcomes before reporting success.
- Provide a clear recovery path where practical.

## Current limitations
- This version does not automatically read ChatGPT history.
- Browser local storage does not sync across devices and can be erased by browser data cleanup.
- No AI model, database backend, authentication, or external action tools are connected yet.
