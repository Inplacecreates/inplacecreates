---
name: cross-repo-task
description: Run a task against another InPlace Creates repo from the HQ repo — resolve the target in the repo registry, attach/clone it, branch, implement, verify, and push. Use whenever the work belongs in a repo other than the one the session started in.
---

# Cross-repo task workflow

You are in the HQ repo but the work targets another InPlace Creates repository. Follow this workflow.

## 1. Resolve the target

Look the repo up in `.claude/repos.yaml`. Confirm:
- The status is `active`. If it's `legacy`/`archive`/`unknown`, tell the user and confirm before proceeding — the work may belong in a successor repo (e.g. Kikao Pride has three legacy repos and one active one).
- You have the right repo when a client has several (HKM, Kikao Pride).

## 2. Get the code

**Remote session (Claude Code on the web):** attach the repo first — call `add_repo` with owner `Inplacecreates` and the repo name, `access: "push"` if you'll push. The tool result gives a clone command; run it, then call `register_repo_root` with the clone path. Don't pre-check the repo with git or curl — private repos 404 to unauthenticated checks; let `add_repo` do the real check.

**Local session:** clone next to the HQ repo: `git clone git@github.com:Inplacecreates/<name>.git ../<name>` (or reuse an existing clone after `git fetch`).

## 3. Branch

Work on `claude/<short-task-slug>` in the target repo. Never commit to `main` directly.

## 4. Match the repo's conventions

Read the target repo's CLAUDE.md/README first. Check its lockfile for the package manager (most org sites: Astro + pnpm + Netlify — but verify per repo). Match its code style; reuse its components instead of adding dependencies.

## 5. Verify

Run whatever the target's package.json defines: build, lint, tests. A change isn't done until the target repo's own build passes.

## 6. Push and record

- Conventional commit message; `git push -u origin <branch>` (retry with backoff on network failures).
- If there's a task file for this in the HQ repo's `tasks/`, update its status and add the branch link.
- If you learned something that contradicts `.claude/repos.yaml` (wrong status, stack, or role), fix the registry in the HQ repo too.

## Delegating

For larger jobs, delegate: `repo-scout` to investigate first, `cross-repo-worker` to implement (it knows this workflow), `site-auditor` for health checks. Parallel tasks across *different* repos can run as parallel agents; parallel work in the *same* repo should stay in one agent.
