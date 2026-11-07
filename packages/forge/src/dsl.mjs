// The vocabulary icon definitions are written in.
import { C, L, poly, rotateD, mirrorD, D, itemOf } from './geo.mjs';
import { SPEC } from './render.mjs';

export const body = (d, o = {}) => ({ role: 'body', d, ...o });
export const line = (d, o = {}) => ({ role: 'line', d, ...o });
export const accent = (d, o = {}) => ({ role: 'accent', d, ...o });
export const tint = (d, o = {}) => ({ role: 'tint', d, ...o });

/**
 * icon(name, title, tags, els, opts)
 *   opts.anim     motion preset name or { preset, ...params } (see motion.mjs)
 *   opts.badges   badge ids to derive (see BADGES) - e.g. ['add', 'check']
 *   opts.turns    direction variants: { up: -90, down: 90, left: 180 } -> renames the
 *                 direction word in the name, rotates the drawing and the motion vector
 *   opts.mirror   { name, title, tags?, axis } - one mirrored twin (undo -> redo)
 *   opts.variants extra hand-written variants [{ name, title, tags, els }]
 */
export const icon = (name, title, tags, els, opts = {}) => ({ name, title, tags, els, ...opts });

// ---------- badges: a small disc at the bottom-right that turns one drawing into a family ----------
const BX = 17;
const BY = 17;
export const BADGES = {
  add: { title: 'Add', tags: ['add', 'plus', 'new', 'create'], glyph: [L(BX - 1.75, BY, BX + 1.75, BY), L(BX, BY - 1.75, BX, BY + 1.75)] },
  remove: { title: 'Remove', tags: ['remove', 'minus', 'subtract', 'delete'], glyph: [L(BX - 1.75, BY, BX + 1.75, BY)] },
  check: { title: 'Check', tags: ['check', 'done', 'complete', 'verified', 'success'], glyph: [poly([[BX - 1.8, BY + 0.1], [BX - 0.5, BY + 1.3], [BX + 1.8, BY - 1.1]], 0.4)] },
  close: { title: 'Close', tags: ['close', 'cancel', 'cross', 'reject', 'error'], glyph: [L(BX - 1.3, BY - 1.3, BX + 1.3, BY + 1.3), L(BX + 1.3, BY - 1.3, BX - 1.3, BY + 1.3)] },
  alert: { title: 'Alert', tags: ['alert', 'warning', 'attention', 'issue'], glyph: [L(BX, BY - 1.8, BX, BY + 0.3), D(BX, BY + 1.85)] },
};
export const BADGE_DISC = C(BX, BY, 4);

// Lines the badge would cut down to a stub (a home bar, a stand) are dropped instead.
const MIN_STUB = 1.2;
function survivesBadge(el) {
  if (el.role === 'body' || el.role === 'tint') return true;
  const zone = itemOf(C(BX, BY, 4 + SPEC.coverGap));
  const it = itemOf(el.d);
  const first = it.firstSegment ?? it.children?.[0]?.firstSegment;
  if (it.length < 0.05) return !zone.contains(first.point);
  const cut = it.subtract(zone, { insert: false, trace: false });
  const len = (cut.children ?? [cut]).reduce((a, p) => a + (p.length ?? 0), 0);
  return len >= MIN_STUB;
}

export function withBadge(els, id) {
  const b = BADGES[id];
  return [...els.filter(survivesBadge), body(BADGE_DISC, { cover: true, badge: true }), ...b.glyph.map((g, i) => (i === 0 ? accent(g, { badge: true }) : line(g, { badge: true })))];
}

export const turnEls = (els, deg) => els.map((e) => ({ ...e, d: rotateD(e.d, deg) }));
export const mirrorEls = (els, axis = 'x') => els.map((e) => ({ ...e, d: mirrorD(e.d, axis) }));
