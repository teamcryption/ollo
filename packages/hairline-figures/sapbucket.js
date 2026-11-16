/**
 * Sap bucket: a round maple bucket on a stump top with its spile and a peaked lid hinged at the back. The lid swings up at the pointer; at rest it sits ajar, bright.
 *
 * The pattern: one part answers (open).
 */
const { Cam, fit, proj, rrect, hull, poly, open, lerp, rad, tween, tset, tval, tdone, mk, pointer, register, disposer, solid } = HL;

const SPEC = {"s":[{"b":[-14,-14,58,58,0,4,30]},{"b":[6,-8,38,2,34,38,4]},{"b":[0,0,44,44,4,38,22]},{"l":[[[1,22,30],[-6,30,44],[14,52,44],[22,45,30]]]}],"m":{"k":"x","h":[-6,42],"rest":10,"max":55,"at":4,"p":[{"b":[-3,-3,47,47,39,43,24],"hi":1},{"b":[5,5,39,39,43,47,17]},{"b":[14,14,30,30,47,50,8]}]}};

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
    read.textContent = v ? "lid up" : "rest";
    B.wake();
  }
  setOn(false);
  const inside = ([x, y]) => x > bx[0] - 8 && x < bx[1] + 8 && y > bx[2] - 8 && y < bx[3] + 8;
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; setAt = performance.now(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "sapbucket",
  means: "A maple sap bucket with a spile: its peaked lid swings up open at the pointer.",
  rules: [1, 5, 6, 9],
  range: [0.4, 1, 1],
  tour: [[200,135],[170,180],[230,230],null],
  mount,
});
