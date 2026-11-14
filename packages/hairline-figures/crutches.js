/**
 * Crutches: three crutches standing in a row on a mat, each a leg with a
 * rubber foot, two rails splitting up to an underarm pad, and a hand grip
 * between the rails. The pointer picks a crutch by where it stands: it swings
 * forward from its foot like a step, and the crutches beside it lean a
 * little, staggered from it. At rest one crutch leans out, bright. The slider
 * is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 30, MZ = 2, SWING = 24, FAV = 1;
const REST = [-5, 13, -2];
// the crutch in its own plane: [u0, z0, u1, z1, radius], back to front
const PARTS = [
  [-5, 29, -5, 40, 1.2], [-5, 40, -5, 62, 1.2], [0, 26, -5, 40, 1.2],
  [0, 0, 0, 3.5, 2.6], [0, 2, 0, 30, 1.5], [0, 25, 0, 30, 2.2],
  [-5, 44, 5, 44, 1.8],
  [0, 26, 5, 40, 1.2], [5, 40, 5, 62, 1.2], [-8, 64, 8, 64, 2.8],
];
const SPH = [];
for (let i = 0; i < 12; i++) {
  const a = (i / 12) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
  SPH.push([c, s, 0], [c, 0, s], [0, c, s]);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.9);
  const X1 = (N - 1) * STEP;
  const lean = (d) => Math.sin((d * Math.PI) / 180) * 66;
  fit(C, [[-14, -10, 0], [X1 + 14, 10, 0], [-10, lean(SWING) + 4, 66], [X1 + 10, lean(SWING) + 4, 66], [-10, lean(-8) - 4, 66], [X1 + 10, -10, 0]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-14, -10, X1 + 14, 10, 5, 1.6);
  put(solid(g), prism(P, front, mr, mi, 0, MZ));

  const cap = (pts) => poly(hull(pts));
  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const paths = PARTS.map(() => mk("path", { class: "sil" }, grp));
    items.push({ k, x: k * STEP, grp, paths, t: tween(REST[k]), last: NaN });
  }

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = (deg * Math.PI) / 180, sa = Math.sin(a), ca = Math.cos(a);
    const W = (u, z) => [it.x + u, z * sa, MZ + z * ca];
    PARTS.forEach(([u0, z0, u1, z1, r], i) => {
      const A = W(u0, z0), Bp = W(u1, z1), pts = [];
      for (const [dx, dy, dz] of SPH) {
        pts.push(P(A[0] + dx * r, A[1] + dy * r, A[2] + dz * r), P(Bp[0] + dx * r, Bp[1] + dy * r, Bp[2] + dz * r));
      }
      it.paths[i].setAttribute("d", cap(pts));
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit against the rest pose: each crutch's standing centre on screen
  const mids = items.map((it) => P(it.x, 0, MZ + 32));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 110 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? REST[k] : dd === 0 ? SWING : dd === 1 ? 5 : 0;
      tset(it.t, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.paths.forEach((p) => p.classList.toggle("hi", on));
    });
    read.textContent = a < 0 ? "rest" : "step " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "crutches",
  means: "Three crutches on a mat: the crutch under the pointer swings forward from its foot like a step, and its neighbours lean a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[160, 136], [221, 167], [283, 198], null],
  mount,
});
