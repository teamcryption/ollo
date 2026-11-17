/**
 * Hay net: a round net of hay hung by its cord from a hook on a stable wall. The net swings out from the wall at the pointer; at rest it hangs a little forward, bright.
 *
 * The pattern: one part answers (swing).
 */
const { Cam, fit, proj, rrect, hull, poly, open, lerp, rad, tween, tset, tval, tdone, mk, pointer, register, disposer, solid } = HL;

const SPEC = {"s":[{"b":[-30,-6,30,0,0,96,3]},{"b":[-2,0,2,14,82,86,1]}],"m":{"k":"x","h":[12,84],"rest":8,"max":55,"at":2,"p":[{"b":[-20,-6,20,32,34,68,18],"hi":1},{"b":[-16,-2,16,28,18,40,14]},{"l":[[[18.8,4.7,46],[19.8,7.8,54],[20.4,11.1,62]],[[17.4,11.3,22],[18.9,8.1,30],[18.8,4.7,38]],[[17.8,5.1,30],[19.8,7.8,38],[20.4,11.1,46],[20.5,14.3,54],[20,17.6,62]],[[17.1,16.9,22],[19.5,14.3,30],[20.4,11.1,38],[19.8,7.8,46],[18.8,4.7,54]],[[16.9,8.6,22],[19.4,11.2,30],[20.5,14.3,38],[20,17.6,46],[19,20.7,54],[17.5,23.6,62]],[[15,22.1,22],[18.1,20.3,30],[20,17.6,38],[20.5,14.3,46],[20.4,11.1,54],[19.8,7.8,62]],[[17.5,14.1,22],[19,17.4,30],[19,20.7,38],[17.5,23.6,46],[15.6,26.3,54],[13.3,28.6,62]],[[11.3,26.3,22],[14.8,25.6,30],[17.5,23.6,38],[19,20.7,46],[20,17.6,54],[20.5,14.3,62]],[[16.2,19.6,22],[16.7,23.1,30],[15.6,26.3,38],[13.3,28.6,46],[10.6,30.5,54],[7.7,32,62]],[[6.6,29.2,22],[10.1,29.7,30],[13.3,28.6,38],[15.6,26.3,46],[17.5,23.6,54],[19,20.7,62]],[[13.3,24.3,22],[12.6,27.8,30],[10.6,30.5,38],[7.7,32,46],[4.6,33,54],[1.3,33.5,62]],[[1.1,30.5,22],[4.4,32,30],[7.7,32,38],[10.6,30.5,46],[13.3,28.6,54],[15.6,26.3,62]],[[9.1,28,22],[7.3,31.1,30],[4.6,33,38],[1.3,33.5,46],[-1.9,33.4,54],[-5.2,32.8,62]],[[-4.4,29.9,22],[-1.8,32.4,30],[1.3,33.5,38],[4.6,33,46],[7.7,32,54],[10.6,30.5,62]],[[3.9,30.1,22],[1.3,32.5,30],[-1.9,33.4,38],[-5.2,32.8,46],[-8.3,31.8,54]],[[-7.9,30.8,30],[-5.2,32.8,38],[-1.9,33.4,46],[1.3,33.5,54],[4.6,33,62]],[[-1.7,30.4,22],[-4.9,31.9,30],[-8.3,31.8,38]],[[-8.3,31.8,46],[-5.2,32.8,54],[-1.9,33.4,62]]]},{"l":[[[0,12,84],[0,12,68]],[[-8,10,68],[-12,6,74]],[[2,12,68],[4,8,75]],[[8,16,68],[13,14,73]]]}]}};

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
    read.textContent = v ? "swing out" : "rest";
    B.wake();
  }
  setOn(false);
  const inside = ([x, y]) => x > bx[0] - 8 && x < bx[1] + 8 && y > bx[2] - 8 && y < bx[3] + 8;
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; setAt = performance.now(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "goatbell",
  means: "A hay net hung from a hook on a stable wall: the full net swings out from the wall at the pointer.",
  rules: [1, 5, 6, 9],
  range: [0.4, 1, 1],
  tour: [[223,185],[159,235],[285,103],null],
  mount,
});
