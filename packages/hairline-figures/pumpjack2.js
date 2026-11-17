/**
 * Cattle grid: a road pit with a fence wing behind and a grid of round bars across it on two bearers. The grid tilts up out of its pit at the pointer, hinged along one end; at rest it is lifted a little, bright.
 *
 * The pattern: one part answers (open).
 */
const { Cam, fit, proj, rrect, hull, poly, open, lerp, rad, tween, tset, tval, tdone, mk, pointer, register, disposer, solid } = HL;

const SPEC = {"s":[{"b":[-46,-40,-42,-36,0,28,1]},{"b":[42,-40,46,-36,0,28,1]},{"b":[-48,-39,48,-37,22,26,1]},{"b":[-48,-39,48,-37,12,16,1]},{"b":[-42,-32,42,32,0,6,4]}],"m":{"k":"y","h":[-38,6],"rest":6,"max":60,"at":5,"p":[{"b":[-38,-28,38,-24,4,8,1]},{"b":[-38,24,38,28,4,8,1],"hi":1},{"b":[-34,-30,-29,30,8,13,2.5]},{"b":[-25,-30,-20,30,8,13,2.5]},{"b":[-16,-30,-11,30,8,13,2.5]},{"b":[-7,-30,-2,30,8,13,2.5]},{"b":[2,-30,7,30,8,13,2.5]},{"b":[11,-30,16,30,8,13,2.5]},{"b":[20,-30,25,30,8,13,2.5]},{"b":[29,-30,34,30,8,13,2.5]}]}};

function xf(m, a, [x, y, z]) {
  const c = Math.cos(rad(a)), s = Math.sin(rad(a));
  if (m.k === "x") { const v = y - m.h[0], w = z - m.h[1]; return [x, m.h[0] + v * c - w * s, m.h[1] + v * s + w * c]; }
  if (m.k === "y") { const u = x - m.h[0], w = z - m.h[1]; return [m.h[0] + u * c - w * s, y, m.h[1] + u * s + w * c]; }
  if (m.k === "z") { const u = x - m.h[0], v = y - m.h[1]; return [m.h[0] + u * c - v * s, m.h[1] + u * s + v * c, z]; }
  return [x + m.v[0] * a, y + m.v[1] * a, z + m.v[2] * a];
}
function boxRings([x0, y0, x1, y1, z0, z1, r]) {
  const n = r > 6 ? 8 : 3, b = Math.min(1.6, (x1 - x0) / 4, (y1 - y0) / 4);
  const o = rrect(x0, y0, x1, y1, r, n), i = rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0, r - b), n);
  return { bot: o.map((q) => [q.u, q.v, z0]), top: o.map((q) => [q.u, q.v, z1]), in: i.map((q) => [q.u, q.v, z1]) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const m = SPEC.m, at = (t) => lerp(m.rest, m.max * amp, t);
  const parts = (list) => list.map((it) => (it.b ? { b: boxRings(it.b), hi: it.hi } : { l: it.l }));
  const st = parts(SPEC.s), mv = parts(m.p);
  const all = (ps, f) => ps.flatMap((p) => (p.b ? p.b.bot.concat(p.b.top) : p.l.flat()).map(f));
  const ext = all(st, (q) => q).concat(all(mv, (q) => xf(m, m.rest, q)), all(mv, (q) => xf(m, m.max, q)));
  const C0 = Cam(45, 0.5, 1); fit(C0, ext, 200, 166); const P0 = proj(C0);
  let w0 = [1e9, -1e9, 1e9, -1e9];
  for (const q of ext) { const s = P0(...q); w0 = [Math.min(w0[0], s[0]), Math.max(w0[1], s[0]), Math.min(w0[2], s[1]), Math.max(w0[3], s[1])]; }
  const C = Cam(45, 0.5, Math.min(320 / (w0[1] - w0[0]), 250 / (w0[3] - w0[2])));
  fit(C, ext, 200, 166);
  const P = proj(C), pr = (pts) => pts.map((q) => P(...q));
  const g = mk("g", {}, svg);
  const draw = (p, f, el) => {
    if (p.b) { el.sil.setAttribute("d", poly(hull(pr(p.b.bot.concat(p.b.top).map(f))))); el.cr.setAttribute("d", poly(pr(p.b.in.map(f)))); }
    else el.setAttribute("d", p.l.map((ln) => open(pr(ln.map(f)))).join(""));
  };
  const make = (p, parent) => { if (p.b) { const s = solid(parent); if (p.hi) s.sil.classList.add("hi"); return s; } return mk("path", { class: "nf" }, parent); };
  let mg = null;
  st.forEach((p, i) => { if (i === m.at) mg = mk("g", {}, g); draw(p, (q) => q, make(p, g)); });
  if (!mg) mg = mk("g", {}, g);
  const mels = mv.map((p) => make(p, mg));
  const rest = all(st, (q) => q).concat(all(mv, (q) => xf(m, m.rest, q))).map((q) => P(...q));
  const bx = [Math.min(...rest.map((q) => q[0])), Math.max(...rest.map((q) => q[0])), Math.min(...rest.map((q) => q[1])), Math.max(...rest.map((q) => q[1]))];
  const tw = tween(0);
  let last = NaN, setAt = -1e9;
  const B = register(stage, (_dt, now) => {
    const a = at(tval(tw, now));
    if (a !== last) { last = a; mv.forEach((p, i) => draw(p, (q) => xf(m, a, q), mels[i])); }
    return !tdone(tw, now) && now - setAt < 1500;
  });
  bag.add(B.unregister);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    setAt = performance.now();
    tset(tw, v ? 1 : 0, setAt, 0);
    read.textContent = v ? "grid up" : "rest";
    B.wake();
  }
  setOn(false);
  const inside = ([x, y]) => x > bx[0] - 8 && x < bx[1] + 8 && y > bx[2] - 8 && y < bx[3] + 8;
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; setAt = performance.now(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "pumpjack2",
  means: "A cattle grid set in a road pit: its grid of bars tilts up out of the pit at the pointer, hinged along one end.",
  rules: [1, 5, 6, 9],
  range: [0.4, 1, 1],
  tour: [[187,206],[204,283],[169,160],null],
  mount,
});
