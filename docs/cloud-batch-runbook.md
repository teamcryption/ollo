# Cloud batch runbook (icon batches)

How to keep shipping icon batches from a fresh session (cloud or local). Read `HANDOFF.md` sections 1, 7, 8, 9 and 13 first. State on writing: batch 195 shipped, 15582 icons (bases through `b195.mjs`). **Target from Abdur (2026-11-11): at least 400 icons per batch** (27+ fresh bases x 15 modifiers; draft ~40, about a third get dropped on the 5-style preview). Check `git log -1` for the latest batch number; full `tools/ship.sh` every 3rd batch (166, 169, 172, ...).

## Rules from Abdur
- Ship batches back to back, **30–40 finished icons each**, without asking between batches. After each batch: republish the preview, post one line ("Batch N complete: X icons, total Y") and start the next.
- Quality is never traded for speed: every new icon is checked in all five styles on a contact sheet; drop anything unclear, look-alike or with broken Fill.
- Originality: never copy competitors or trademarks.

## Setup
```bash
source tools/batch/env.sh          # git identity, pnpm via corepack (Linux/macOS)
pnpm install
```
Commit on `icons/batch-1`. **Before every batch run `git pull --ff-only origin icons/batch-1`** (batches alternate between the PC session and the cloud session; GitHub is the handover point). Push after every batch: `git push origin icons/batch-1`. Never run two batch sessions at once.

## The fast loop (one batch)
All helper scripts are in `tools/batch/`; run them from `packages/forge`.
1. **Write a spec** module (see `tools/batch/example-spec.mjs`): `export default { <category>: ["icon(...)", ...] }`. For combo icons (compact base top-left + modifier bottom-right), use `combos([[base, modifier, title, 'tags, comma separated', category], ...])` from `mods.mjs`; modifiers are `search clock shield gear pin lock bolt heart star`; add new compact bases to `B` (`Object.assign(B, {...})`).
2. **Check names**: `node ../../tools/batch/checknames.mjs <spec>` (exits 1 on any taken name, hyphens stripped). `generate.mjs` does NOT reject existing names.
3. **Write defs**: `node ../../tools/batch/writebatch.mjs defs <spec>` (creates new `defs/<category>-N.mjs` files; never edit old defs files).
4. **Variants** (badges/off/containers/mirror/turns) go in `src/variant-plan.mjs` via `node ../../tools/batch/planadd.cjs '<json>'`. **Pitfall:** the plan is one object literal; adding a key that already exists replaces the old entry and generate then *deletes* that entry's icons. `planadd.cjs` merges, but if the existing entry already has the same property (e.g. `badges`), edit that line by hand. Plan entries only affect forge-drawn bases (Figma-sourced bases like `chat` ignore them).
5. **Generate + QA**: `node src/generate.mjs > /tmp/gen.log 2>&1; grep -A16 "QA errors" /tmp/gen.log`. Fix or drop offenders (delete the def line; generate removes the icon folder itself).
6. **Review**: `node tools/sheet.mjs /tmp/sheet.png "a,b,c"` from the repo root, and look at it.
7. **Safety check before commit**: `git status --short | grep -c "^ D"` must print `0` (anything else means existing icons were deleted).
8. **Commit**: `node --test test/forge.test.mjs`, then `git add -A && git commit` with subject `Icons batch N: <count> <topics> icons` (exact format; the preview parses `batch N`) and the trailer from `env.sh`. Every 3rd batch (166, 169, 172, ...) run `bash tools/ship.sh "<subject>" "<body>"` instead (full build + build tests + tsc + commit).

## Bulk batches (300+ icons, current method from batch 162)
Abdur wants **at least 400 icons per batch** (raised from 300 on 2026-11-11). Use the bulk generator: every unused base x modifier pair, with titles/tags from templates.
- Bases: `B` in `tools/batch/mods.mjs` plus every `tools/batch/b1NN.mjs` spec (all are auto-imported by `bulk.mjs`). Add new compact bases in a new `b1NN.mjs` (see `b164.mjs`; set `globalThis.BULK_CAT`/`BULK_LABEL` for new bases).
- Modifiers in `bulk.mjs`: search clock shield gear pin bolt heart star alert user bell cloud chat download pencil (+ lock add check close remove, which mostly fail QA or look cramped). Pairs used up so far: all of these on the bases through b164.
- Run from `packages/forge`: `BULK_MAX=330 BULK_MODS=<mods> bash ../../tools/batch/runbulk.sh`. It writes defs, generates, drops QA offenders into `tools/batch/drop.txt` and retries.
- Review: sheet a sample of each modifier (`node tools/sheet.mjs`), drop weak bases by appending their names to `drop.txt` (or the skip list in `bulk.mjs`) and rerun. Never let `^ D` be non-zero.
- Next yield: draw 25–35 new compact bases per batch (x 3–16, y 3–19, bottom-right kept clear) x 15 modifiers ≈ 400+ (aim for 27+ bases).

## Preview (new site UI)
The preview link is https://claude.ai/artifact/FZsFNNvadJTNKkKmesLT2S (downloads capability already declared; omit `capabilities` when republishing). It is built from the website branch:
```bash
git worktree add ../library-web web/ui    # once
(cd ../library-web && pnpm install)       # once
cd ../library-web && LIBRARY_ROOT=<path to this repo> node apps/web/scripts/build-preview.mjs /tmp/review-ui
```
Since ~7,900 icons the icon JSONs approach the Artifact 16 MB per-file limit; before publishing run `node tools/batch/compact-preview.mjs /tmp/review-ui/data/icons/*.json` (preview copy only, repo SVGs untouched): it rounds path coordinates to 2 decimals, minifies path data losslessly (leading zeros and unneeded separators) and wraps runs of paths with identical (inherited) attributes in one `<g>` that carries them (each path stays its own element; steps 2-3 render pixel-identical to rounding alone, also after the site's stroke-width/colour edits). Do not merge paths into one `d`: that changes anti-aliasing where strokes overlap. At 12,700 icons the largest file is fill.json at ~14.0 MB (its icons are single compound paths, so grouping does not shrink it), about four 400-icon batches of headroom; after that the lasting fix is splitting fill.json in `build-preview.mjs` on `web/ui`.

When any preview data file would exceed ~15 MB after compaction, run `node tools/batch/split-preview.mjs /tmp/review-ui` (after compact-preview): it splits that file into `name.partN.json` and injects a fetch shim into the preview `index.html` that loads and merges the parts, so the app (and `web/ui`) is unchanged. Publish the printed `add` paths, and map each printed `remove` path to `null` in `files` the first time a file is split. Tested: Fill/Duotone styles and the Animated view load from parts with no errors.

Since ~10,000 icons the eight files total more than the 64 MB one publish can send: publish in two calls to the same `url`, first `index.html` with index/motion/illustrations/bold/duotone/fill, then `index.html` with light/regular.

Publish `/tmp/review-ui/index.html` with `root=/tmp/review-ui`, `url` = the link, and the 8 files the script prints (`data/index.json`, `data/motion.json`, `data/illustrations.json`, `data/icons/{light,regular,bold,duotone,fill}.json`). Do not use `packages/forge/src/review.mjs` (old UI). Never commit to `web/ui` from a batch session.

## Yield notes
- Each bulk batch now needs ~20–25 fresh bases (one per row of 15 modifiers). Preview them first on a 5-style sheet; expect to drop ~25% (look-alikes: crystal ball ~ user, fries ~ hand, kettlebell ~ padlock, purse ~ bag).
- `grep -c` exits 1 when it counts 0, so don't chain `&&` after the `^ D` safety check.
- Above ~6,000 icons the duplicate check needed a pair bitset (`qa.mjs`, commit `c50cf994`); if generate dies with a RangeError, look there first.
- Everyday objects are nearly exhausted: new drawings often trip the duplicate check. Combo families (bases x modifiers) and meaningful status variants give the best yield.
- Small glyphs inside circles/squares/pages often duplicate each other; keep glyphs large and distinct.
- Bases that read badly as small combos: key (looks like a magnifier), truck (box), coins (database cylinder).
- "No" signs: draw the slash over the glyph (no `cover`), or it cuts the glyph apart.

## Single-pass bulk runner (from batch 201)
- `bash ../../tools/batch/runbulk1.sh` (from `packages/forge`, same env as runbulk.sh): one generate pass with `DROP_FILE`; QA offenders among the new icons are dropped and written to `drop.txt` instead of blocking the write (~9 min per 1,500 candidates at 30k icons).
- Good badges (33): search clock shield gear pin bolt heart star alert user bell cloud chat download pencil sparkle trash flag calendar question bookmark upload crown moon leaf fire trophy hourglass cursor camera filter stats checkbox. Failing or unreadable (disabled/avoid): eye tag wifi percent plus pause music key truck lock add check close remove; bulb/addbox/notice/pricing mostly fail as look-alikes.
- After batch 215 all good badges are used on all bases. More icons now come from new bases in `tools/batch/b2NN.mjs` (each new base x 33 badges ~ 30 icons). Review one sample per new base; drop weak bases (append their combo names to drop.txt, delete their def lines and icon folders).
- Preview: compact-preview.mjs then `split-preview.mjs <dir> 12`; publish in 3 calls (index+illustrations+motion parts+duotone parts / fill parts+light parts / regular+bold parts), each under 64 MB. The account allows 200 artifact file uploads per day.
