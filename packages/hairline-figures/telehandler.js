/**
 * Telehandler: a four-wheeled body with a side cab and a long telescopic
 * boom pinned at the rear, a fork carriage at its tip. Over the machine the
 * boom swings up and its inner section slides out on the 700ms ease; leaving
 * lowers and retracts it, the forks bright. The slider is how far it reaches.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, clamp, lerp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = -34, PZ = 26, A0 = 6, E0 = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.78);
  fit(C, [[-44, -16, 0], [62, 16, 0], [62, -16, 0], [-44, 16, 0], [36, -14, 92], [58, 0, 70]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (par, x0, y0, x1, y1, z0, z1, r = 2, b = 1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, o, i, z0, z1)); return s; };
  const wheel = (cx, y, dy) => {
    const ring = (yy, r) => Array.from({ length: 22 }, (_, i) => { const t = (i / 22) * Math.PI * 2; return P(cx + r * Math.cos(t), yy, 9 + r * Math.sin(t)); });
    mk("path", { d: poly(hull(ring(y, 9).concat(ring(y + dy, 9)))), class: "sil" }, g);
    mk("path", { d: poly(ring(y + (dy > 0 ? dy : 0), 3.5)), class: "nf lo" }, g);
  };
  wheel(-24, -16, 4); wheel(20, -16, 4);
  box(g, -40, -12, 34, 12, 8, 20, 4, 1.4);
  box(g, -14, -12, 8, -1, 20, 46, 4, 1.4);
  box(g, -15, -13, 9, 0, 46, 48, 3, 1);
  // the boom: an outer and an inner section along the angle, and the forks at the tip
  const boom = mk("g", {}, g);
  const outer = mk("path", { class: "sil" }, boom), inner = mk("path", { class: "sil" }, boom);
  const carriage = mk("path", { class: "sil hi" }, boom), tines = mk("path", { class: "sil hi" }, boom);
  wheel(-24, 12, 4); wheel(20, 12, 4);
  const sec = (a0, a1, y0, y1, n0, n1, T) => { const pts = []; for (const n of [n0, n1]) for (const s of rrect(a0, y0, a1, y1, 1.5, 3)) pts.push(P(...T(s.u, s.v, n))); return poly(hull(pts)); };
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const th = rad(lerp(A0, 6 + 36 * reach, t)), e = lerp(E0, 4 + 24 * reach, t);
    const c = Math.cos(th), s = Math.sin(th);
    const T = (a, y, n) => [PX + a * c - n * s, y, PZ + a * s + n * c];
    outer.setAttribute("d", sec(-4, 58, 1, 10, -4, 4, T));
    inner.setAttribute("d", sec(50, 62 + e, 2, 9, -3, 3, T));
    const [tx, , tz] = T(62 + e, 0, 0);
    const cb = [];
    for (const y of [-2, 12]) for (const [dx, dz] of [[0, -16], [2, -16], [2, 4], [0, 4]]) cb.push(P(tx + dx, y, tz + dz));
    carriage.setAttribute("d", poly(hull(cb)));
    const tn = (y0) => { const p = []; for (const y of [y0, y0 + 2.5]) for (const [x, z] of [[2, -16], [20, -16], [20, -14.5], [2, -14.5]]) p.push(P(tx + x, y, tz + z)); return poly(hull(p)); };
    tines.setAttribute("d", tn(-1) + tn(8));
  }
  const B = register(stage, (dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  function move([sx, sy]) {
    if (Math.abs(sx - 200) > 140 || sy < 15 || sy > 305) return leave();
    tset(tw, 1, performance.now(), 0);
    read.textContent = "reach " + Math.round(reach * 100);
    B.wake();
  }
  function leave() { tset(tw, 0, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 0.4, 1); last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "telehandler",
  means: "A telehandler: over it the telescopic boom swings up and slides out, carrying the forks; the slider sets how far it reaches.",
  rules: [3, 5, 8],
  range: [0.4, 0.7, 1],
  tour: [[171, 141], [249, 90], [210, 205], null],
  mount,
});
