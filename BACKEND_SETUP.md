# Backend foundation — Alice Next Level

This project must stay separate from ZPS, NOVEX, and every other app.

## Why this is the next step
The live v0.1 notebook stores memories in the current browser only. This SQL foundation adds an owner-scoped database model for project spaces and memories, with Row Level Security (RLS). It does not automatically import ChatGPT history.

## Setup checklist
1. Create a new, dedicated Supabase project for Alice Next Level. Do not reuse another project's database.
2. In Supabase, open SQL Editor, then choose New query.
3. Copy supabase/schema.sql into the editor and run it.
4. In Authentication > Providers, enable Email authentication. For the first test, use a private account you control.
5. Keep the project URL and publishable/anon key for client configuration only. Never expose a service_role key, database password, or model-provider API key in browser code, GitHub, screenshots, or chat.
6. Do not connect the current public notebook to the database until sign-in, session handling, and RLS have been implemented and tested.

## Security model
- Every project and memory has an owner_id tied to Supabase Auth.
- RLS policies allow authenticated owners to manage only their own projects and memories.
- A memory must belong to a project owned by the same signed-in user.
- The schema intentionally grants no anonymous access.
- Project isolation is enforced in the database, not only by hiding UI elements.

## Not implemented yet
- Login/sign-up UI and session management.
- Connecting the frontend to Supabase.
- Migration/import of local browser memories.
- Semantic/AI retrieval and model provider.
- Server-side model calls and rate limiting.

## Before enabling AI
Use a server-side function for provider calls, store secrets in the hosting provider's environment settings, and explain any potential paid usage first. Never put model API secrets in public frontend JavaScript.
