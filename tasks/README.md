# InPlace Creates — Tasks

Lightweight task tracking for all InPlace Creates work, code and non-code. The `task-manager` agent (`.claude/agents/task-manager.md`) maintains this directory — you can just tell Claude "add a task: ..." or "what's active?".

## How it works

- **One file per task**: `tasks/YYYY-MM-DD-short-slug.md` (date = when captured). Copy `templates/task.md`.
- **Status lives in frontmatter**, not in folders — nothing gets moved around:
  - `backlog` — captured, not started
  - `active` — being worked on
  - `blocked` — waiting on someone/something (say what, in Notes)
  - `done` — finished (files are never deleted)
- **`repo`** points at the target repo from `.claude/repos.yaml`, or `-` for non-code work (proposals, invoicing, content planning).
- **Notes are an append-only log**: add dated bullets as things happen; don't rewrite old entries.

## Quick queries

```bash
# Everything active
grep -l "status: active" tasks/*.md

# Backlog for one client
grep -l "client: kikao-pride" tasks/*.md | xargs grep -l "status: backlog"
```
