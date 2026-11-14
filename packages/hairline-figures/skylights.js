/**
 * Skylights: a gabled house with three roof windows on the near slope. The
 * pointer picks a skylight by where it stands: its sash swings open on the
 * hinge at its top edge, and the sashes beside it open a crack, staggered
 * from it. At rest the middle one stands ajar, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, fillet, hull, open, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 120, D = 60, H = 30, R = 28, OV = 5, N = 3, SW = 27, S0 = 5, S1 = 33, OPEN = 58, FAV = 1;
const HALF = D / 2, SL = Math.hypot(HALF, R);
const dv = [0, HALF / SL, -R / SL], nv = [0, R / SL, HALF / SL];
const zAt = (y) => H + R * (1 - Math.abs(y - HALF) / HALF);
const onSlope = (x, s, h = 0) => [x, HALF + dv[1] * s + nv[1] * h, H + R + dv[2] * s + nv[2] * h];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-OV, -OV, 0], [W + OV, D + OV, 0], [W + OV, -OV, 0], [-OV, D + OV, 0], [0, HALF, H + R], [W, HALF, H + R + 12]], 200, 170);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 2, 1.5);
  put(solid(g), prism(P, () => true, br, bi, 0, H));
  // the roof: a gable, with a second line for its thickness at the eaves
  const zE = zAt(D + OV), xs = [-OV, W + OV];
  const top = [], low = [];
  for (const x of xs) {
    top.push(P(x, -OV, zE), P(x, HALF, H + R), P(x, D + OV, zE));
    low.push(P(x, -OV, zE - 2.5), P(x, D + OV, zE - 2.5));
  }
  const roof = solid(g);
  put(roof, {
    sil: poly(fillet(hull(top.concat(low)), hull(top.concat(low)).map(() => 1.5))),
    crease: open([P(-OV, HALF, H + R), P(W + OV, HALF, H + R)]) + seg(P(-OV, D + OV, zE), P(W + OV, D + OV, zE)) + seg(P(W + OV, -OV, zE), P(W + OV, HALF, H + R)) + seg(P(W + OV, HALF, H + R), P(W + OV, D + OV, zE)),
  });

  const items = [];
  for (let k = 0; k < N; k++) {
    const cx = W / 2 + (k - 1) * 38, x0 = cx - SW / 2, x1 = cx + SW / 2, grp = mk("g", {}, g);
    const fr = [onSlope(x0 - 2, S0 - 2, 0.4), onSlope(x1 + 2, S0 - 2, 0.4), onSlope(x1 + 2, S1 + 2, 0.4), onSlope(x0 - 2, S1 + 2, 0.4)].map((p) => P(...p));
    mk("path", { d: poly(fillet(fr, [2, 2, 2, 2])), class: "lo" }, grp);
    const well = [onSlope(x0, S0, 0.5), onSlope(x1, S0, 0.5), onSlope(x1, S1, 0.5), onSlope(x0, S1, 0.5)].map((p) => P(...p));
    mk("path", { d: poly(fillet(well, [1, 1, 1, 1])), class: "nf lo" }, grp);
    const sash = mk("path", { class: "sil" }, grp), edge = mk("path", { class: "nf lo" }, grp);
    items.push({ k, cx, x0, x1, sash, edge, a: tween(k === FAV ? 22 : 0), last: NaN });
  }

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180), L = S1 - S0;
    const pt = (x, t, h) => { const b = onSlope(x, S0, 1.2); return [x, b[1] + (dv[1] * c + nv[1] * s) * t + (nv[1] * c - dv[1] * s) * h, b[2] + (dv[2] * c + nv[2] * s) * t + (nv[2] * c - dv[2] * s) * h]; };
    const pts = [];
    for (const x of [it.x0 - 1, it.x1 + 1]) for (const t of [-1, L + 1]) for (const h of [0, 2]) pts.push(P(...pt(x, t, h)));
    const hl = hull(pts);
    it.sash.setAttribute("d", poly(fillet(hl, hl.map(() => 1.5))));
    it.edge.setAttribute("d", poly(fillet([pt(it.x0 + 2, 2, 2), pt(it.x1 - 2, 2, 2), pt(it.x1 - 2, L - 2, 2), pt(it.x0 + 2, L - 2, 2)].map((p) => P(...p)), [1, 1, 1, 1])));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(...onSlope(it.cx, (S0 + S1) / 2, 6)));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 55 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), ang = a < 0 ? (k === FAV ? 22 : 0) : dd === 0 ? OPEN : dd === 1 ? 30 : 0;
      tset(it.a, ang, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sash.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "sky " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "skylights",
  means: "Three roof windows on a gabled house: the sash under the pointer swings open on its top hinge, its neighbours open a crack.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[133, 112], [180, 136], [227, 159], null],
  mount,
});
