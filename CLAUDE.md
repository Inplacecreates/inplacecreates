# InPlace Creates — HQ Repository

This is the **global operations repo** for the InPlace Creates organization. It serves two purposes:

1. **HQ / mission control** — org-wide context, the registry of every repo in the org, agent definitions, and task tracking for InPlace Creates work. Start Claude sessions here when a task spans repos or you're not sure where it belongs.
2. **Legacy site** — the repo also carries the previous InPlace Creates Astro site (`src/`, `public/`) and an older static-site archive (`archive/`). The **current** agency website lives in the separate `Inplacecreates/inplace-creates-website` repo. Do not confuse the two.

## How to work from this repo

- **Know the org**: read `.claude/repos.yaml` — it lists every repository with its purpose and status. Keep it updated when repos are added, archived, or repurposed.
- **Cross-repo work**: use the `cross-repo-task` skill (`.claude/skills/cross-repo-task/`). In remote sessions, other repos must be attached with the `add_repo` tool before you can clone or push to them. In local sessions, clone them next to this repo.
- **Tasks**: tracked in `tasks/` (see `tasks/README.md`). One markdown file per task; move between `backlog`, `active`, and `done` sections by editing status.
- **Agents**: specialized subagents live in `.claude/agents/`. Use them via the Agent tool — e.g. `repo-scout` for read-only investigation across repos, `cross-repo-worker` for making changes in another repo, `site-auditor` for auditing one of the client sites.

## Conventions for work in any org repo

- Branch names: `claude/<short-task-slug>` unless the session assigns one.
- Commit style: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`) — matches existing history across the org.
- Most sites are Astro + Netlify, package manager is `pnpm` unless the target repo's lockfile says otherwise.
- Never force-push to `main` in any repo. Never delete branches you didn't create.
- When a task touches a client site, note which client/repo in the commit message and in the task file.

## Repo layout

```
.claude/
  repos.yaml        # org-wide repo registry (source of truth)
  agents/           # subagent definitions usable from any session in this repo
  skills/           # workflows (cross-repo-task, ...)
tasks/              # InPlace Creates task tracking
src/, public/       # legacy Astro site (superseded by inplace-creates-website)
archive/            # pre-Astro static site, kept for reference
```
