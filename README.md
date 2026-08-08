# InPlace Creates — HQ

Global operations repo for the [InPlace Creates](https://github.com/Inplacecreates) organization: org-wide context, the registry of every repo, Claude agents that work across them, and task tracking.

**Start here** when a task spans repos or you're not sure where it belongs. See [CLAUDE.md](CLAUDE.md) for how sessions in this repo operate.

| Where | What |
|---|---|
| [`.claude/repos.yaml`](.claude/repos.yaml) | Registry of all org repositories — roles, stacks, status |
| [`.claude/agents/`](.claude/agents/) | Subagents: `repo-scout`, `cross-repo-worker`, `site-auditor`, `task-manager` |
| [`.claude/skills/cross-repo-task/`](.claude/skills/cross-repo-task/) | The attach → branch → verify → push workflow for other repos |
| [`tasks/`](tasks/) | InPlace Creates task tracking (one markdown file per task) |
| `src/`, `public/` | Legacy Astro agency site — superseded by [`inplace-creates-website`](https://github.com/Inplacecreates/inplace-creates-website) |
| `archive/` | Pre-Astro static site, kept for reference |
