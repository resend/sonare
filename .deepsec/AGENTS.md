# Agent setup

This is a deepsec scanning workspace. A newly registered project gets a
one-time setup prompt at `data/<id>/SETUP.md`, which can be deleted once
its `INFO.md` is filled in. `sonare` is past that step:
`data/sonare/INFO.md` is complete, so it has no `SETUP.md`.

## Common tasks

- **Set up or resume a project**: run `pnpm deepsec setup`. For a
  scaffold-only/manual setup of a newly added project, read its
  `data/<id>/SETUP.md` and follow it.
- **Add a new project**: run `pnpm deepsec init-project <root>` — it
  scaffolds `data/<id>/` and prints/writes the setup prompt for the
  new project.
- **Write a custom matcher** (only after a real true-positive shows you
  a pattern worth keeping): read
  `node_modules/deepsec/dist/docs/writing-matchers.md`.

## Reference

The deepsec skill is at `node_modules/deepsec/SKILL.md` (after
`pnpm install`). The full docs ship at
`node_modules/deepsec/dist/docs/`.
