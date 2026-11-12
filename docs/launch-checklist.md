# Launch checklist (prepared 2026-11-12, nothing launched)

Status of everything needed to put ollo live. **Nothing here is published, merged or deployed yet; each step waits for Abdur's go.**

## 1. Icon library: ready
- 37,819 icons x 5 styles = 189,095 SVG files (target was 80,000 files).
- Full QA over the whole library on 2026-11-12: **0 errors** (1,280 minor warnings, e.g. drawing close to the edge).
- Full build on 2026-11-12 passes: 37,819 icons, 189,095 SVGs, 37,824 React components; build, forge and React type-check tests green (build takes ~17 min at this size).
- All work is on branch `icons/batch-1` (pushed to GitHub `teamcryption/ollo`), last commit batch 223.
- Every icon has animation data (motion spec in `meta.json`).

## 2. Code branches: need merging
| Branch | What | State |
|---|---|---|
| `icons/batch-1` | icons + forge + build packages | 239 commits ahead of `main` |
| `web/ui` | the website (Next.js) | 147 commits ahead of `main` |
| `main` | only the first scaffold | default branch on GitHub |

**To do (needs go):** merge `icons/batch-1` and `web/ui` into `main` (or a `release` branch), resolve any conflicts, tag `v1.0.0`.

## 3. Website (`apps/web` on `web/ui`): built, not hosted
Done: library UI from the Figma screens (icons grid, animated icons, illustrations, download modals, light/dark, tablet/phone), search and filters, copy SVG/JSX, downloads (SVG, PNG, Lottie JSON, .lottie, GIF, animated SVG), Subscribe page (Free, Pro $8/month or $72/year).

Missing before launch:
- **Hosting + domain** (e.g. Vercel or Cloudflare Pages; a domain name). Decision needed.
- **Payments**: the Subscribe page shows "Checkout isn't connected yet". Needs a payment provider (Stripe, Lemon Squeezy or Paddle) and a decision on what Pro unlocks.
- **Accounts / login** for Pro users (not built).
- **Scale test**: the site data is ~60 MB for 37k icons in 5 styles; load data per style/category on demand instead of one big file before going live.
- Legal pages: licence (what free vs Pro users may do), terms, privacy.

## 4. Developer packages: built, not published
- `@library/react` (React components): generates and type-checks; not on npm. Needs an npm org/name decision, then publish.
- Raw SVG / CDN bundle: build exists in `packages/build`; needs a CDN (npm + jsDelivr/unpkg works automatically once published).

## 5. Figma plugin: not built
- `apps/figma-plugin` is a placeholder. Needs building, then submitting to the Figma Community (review takes a few days).

## 6. Illustrations: thin
- Only the 5 approved sample scenes exist. The product promises icons **and** illustrations; either launch icons-first or build an illustration batch before launch.

## 7. Decisions for Abdur
1. Launch scope: icons only first, or wait for illustrations?
2. Domain name and hosting provider.
3. Payment provider, and what Pro includes vs Free.
4. npm package name / organisation (e.g. `@ollo/react`).
5. Launch date, so the remaining work can be planned backwards from it.
