# Cloud batch runbook (icon batches)

How to keep shipping icon batches from a fresh session (cloud or local). Read `HANDOFF.md` sections 1, 7, 8, 9 and 13 first. State on writing: batch 159 shipped (commit `354af373`), 3,599 icons. Next batch: **160** (due a full `tools/ship.sh` build).

## Rules from Abdur
- Ship batches back to back, **30–40 finished icons each**, without asking between batches. After each batch: republish the preview, post one line ("Batch N complete: X icons, total Y") and start the next.
- Quality is never traded for speed: every new icon is checked in all five styles on a contact sheet; drop anything unclear, look-alike or with broken Fill.
- Originality: never copy competitors or trademarks.

## Setup
```bash
source tools/batch/env.sh          # git identity, pnpm via corepack (Linux/macOS)
pnpm install
```
Commit on `icons/batch-1`. Push after every batch: `git push origin icons/batch-1`.

## The fast loop (one batch)
All helper scripts are in `tools/batch/`; run them from `packages/forge`.
1. **Write a spec** module (see `tools/batch/example-spec.mjs`): `export default { <category>: ["icon(...)", ...] }`. For combo icons (compact base top-left + modifier bottom-right), use `combos([[base, modifier, title, 'tags, comma separated', category], ...])` from `mods.mjs`; modifiers are `search clock shield gear pin lock bolt heart star`; add new compact bases to `B` (`Object.assign(B, {...})`).
2. **Check names**: `node ../../tools/batch/checknames.mjs <spec>` (exits 1 on any taken name, hyphens stripped). `generate.mjs` does NOT reject existing names.
3. **Write defs**: `node ../../tools/batch/writebatch.mjs defs <spec>` (creates new `defs/<category>-N.mjs` files; never edit old defs files).
4. **Variants** (badges/off/containers/mirror/turns) go in `src/variant-plan.mjs` via `node ../../tools/batch/planadd.cjs '<json>'`. **Pitfall:** the plan is one object literal; adding a key that already exists replaces the old entry and generate then *deletes* that entry's icons. `planadd.cjs` merges, but if the existing entry already has the same property (e.g. `badges`), edit that line by hand. Plan entries only affect forge-drawn bases (Figma-sourced bases like `chat` ignore them).
5. **Generate + QA**: `node src/generate.mjs > /tmp/gen.log 2>&1; grep -A16 "QA errors" /tmp/gen.log`. Fix or drop offenders (delete the def line; generate removes the icon folder itself).
6. **Review**: `node tools/sheet.mjs /tmp/sheet.png "a,b,c"` from the repo root, and look at it.
7. **Safety check before commit**: `git status --short | grep -c "^ D"` must print `0` (anything else means existing icons were deleted).
8. **Commit**: `node --test test/forge.test.mjs`, then `git add -A && git commit` with subject `Icons batch N: <count> <topics> icons` (exact format; the preview parses `batch N`) and the trailer from `env.sh`. Every 3rd batch (160, 163, 166, ...) run `bash tools/ship.sh "<subject>" "<body>"` instead (full build + build tests + tsc + commit).

## Preview (new site UI)
The preview link is https://claude.ai/artifact/FZsFNNvadJTNKkKmesLT2S (downloads capability already declared; omit `capabilities` when republishing). It is built from the website branch:
```bash
git worktree add ../library-web web/ui    # once
(cd ../library-web && pnpm install)       # once
cd ../library-web && LIBRARY_ROOT=<path to this repo> node apps/web/scripts/build-preview.mjs /tmp/review-ui
```
Publish `/tmp/review-ui/index.html` with `root=/tmp/review-ui`, `url` = the link, and the 8 files the script prints (`data/index.json`, `data/motion.json`, `data/illustrations.json`, `data/icons/{light,regular,bold,duotone,fill}.json`). Do not use `packages/forge/src/review.mjs` (old UI). Never commit to `web/ui` from a batch session.

## Yield notes
- Everyday objects are nearly exhausted: new drawings often trip the duplicate check. Combo families (bases x modifiers) and meaningful status variants give the best yield.
- Small glyphs inside circles/squares/pages often duplicate each other; keep glyphs large and distinct.
- Bases that read badly as small combos: key (looks like a magnifier), truck (box), coins (database cylinder).
- "No" signs: draw the slash over the glyph (no `cover`), or it cuts the glyph apart.
