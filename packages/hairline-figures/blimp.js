/**
 * Airship: a long envelope moored nose-first to a mast on a round pad, a
 * gondola slung under it and a cross of fins at the tail. The pointer over
 * the airship lets it weathervane round the mast, the whole ship swinging
 * about its nose. At rest it sits a little off the wind, bright. The slider
 * is how far it swings.
 *
 * The pattern: one hinged part (yaw about a pin).
 */
const { Cam, fit, hull, poly, open, proj, rad, lerp, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const L = 136, R = 16, ZC = 50, REST = -20;
const prof = (t) => Math.pow(Math.sin(Math.PI * Math.pow(t, 0.85)), 0.5);
const tube = (x0, x1, rr, yc, zc, pf, n = 18, m = 16) => {
  const pts = [];
  for (let i = 0; i <= n; i++) { const t = i / n, r = rr * pf(t), x = lerp(x0, x1, t); for (let j = 0; j < m; j++) { const a = (j / m) * Math.PI * 2; pts.push([x, yc + r * Math.cos(a), zc + r * Math.sin(a)]); } }
  return pts;
};
const box = (x0, y0, z0, x1, y1, z1) => { const p = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) p.push([x, y, z]); return p; };
const fin = (x0, x1, a, b, axis) => { const p = []; for (const [x, s] of [[x0, 0.25], [x1 - 6, 1], [x1, 1], [x1, 0.2]]) { const e = a + (b - a) * s; p.push(axis === "z" ? [x, -1.2, e] : [x, e, ZC - 1.2], axis === "z" ? [x, 1.2, e] : [x, e, ZC + 1.2]); } return p; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.0);
  const yaw = (p, d) => { const a = rad(d), c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; };
  const fp = [[0, 0, 0], [-14, -14, 0], [14, 14, 0]];
  for (const d of [REST, REST - 35, REST - 70]) for (const z of [8, ZC + 30]) fp.push(yaw([L, 0, z], d));
  fit(C, fp, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const pad = []; for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2; pad.push(P(14 * Math.cos(a), 14 * Math.sin(a), 0)); }
  mk("path", { d: poly(pad) }, g);
  mk("path", { d: poly(hull(tube(-1, 1, 1, 0, 0, () => 2.2, 1, 10).map((q) => P(q[1] * 0 + q[0] * 0 + 2.2 * Math.cos(0), 0, 0)).concat(box(-2.4, -2.4, 0, 2.4, 2.4, ZC).map((q) => P(...q))))), class: "sil" }, g);
  for (const s of [-1, 1]) mk("path", { d: open([P(10 * s, -10 * s, 0), P(0, 0, ZC * 0.6)]), class: "nf lo" }, g);
  const ship = mk("g", {}, g);
  const parts = [
    { pts: box(46, -6, ZC - R - 10, 74, 6, ZC - R + 4), cls: "" },
    { pts: tube(0, L, R, 0, ZC, prof), cls: "sil hi", crease: Array.from({ length: 21 }, (_, i) => [lerp(10, L - 12, i / 20), 0, ZC + R * prof(lerp(10, L - 12, i / 20) / L) * 0.98]) },
    { pts: fin(L - 26, L + 2, ZC, ZC + 30, "z"), cls: "" },
    { pts: fin(L - 26, L + 2, 0, -30, "y"), cls: "nf lo" },
    { pts: fin(L - 26, L + 2, 0, 30, "y"), cls: "" },
  ].map((pt) => ({ ...pt, el: mk("path", { class: pt.cls }, ship), cel: pt.crease ? mk("path", { class: "nf lo" }, ship) : null }));
  const tw = tween(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    for (const pt of parts) {
      pt.el.setAttribute("d", poly(hull(pt.pts.map((q) => P(...yaw(q, d))))));
      if (pt.cel) pt.cel.setAttribute("d", open(pt.crease.map((q) => P(...yaw(q, d)))));
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = parts[1].pts.map((q) => P(...yaw(q, REST)));
  const xs = rest.map((q) => q[0]), ys = rest.map((q) => q[1]);
  const bx = [Math.min(...xs) - 10, Math.max(...xs) + 10, Math.min(...ys) - 20, Math.max(...ys) + 40];
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? REST - max : REST, performance.now(), 0);
    read.textContent = a ? "yaw " + Math.round(max) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3]), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "blimp",
  means: "An airship moored to a mast: the pointer over it lets the whole ship weathervane round the mast on its nose.",
  rules: [1, 3, 5, 6],
  range: [20, 45, 70],
  tour: [[151, 190], [205, 175], [255, 160], null],
  mount,
});
