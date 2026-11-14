/**
 * Window shutters: a house wall with three windows, each with a sill and a
 * pair of shutters hinged at its sides. The pointer picks a window by where
 * it stands: its shutters swing open, and the windows beside it open theirs
 * a crack, staggered from it. At rest the shutters stand at uneven angles
 * and one pair is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 22, STEP = 50, PAD = 14, Y = 0, TH = 6, H = 74, Z0 = 22, Z1 = 56, T = 1.4, FAV = 1;
const X1 = PAD * 2 + (N - 1) * STEP + W;
const REST = [14, 72, 0], OPEN = 112;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[0, -TH, 0], [X1, -TH, H], [X1, Y + 14, 0], [0, Y + 14, 0], [X1, Y, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, -TH, X1, Y, 2, 1.2);
  put(solid(g), prism(P, front, wr, wi, 0, H));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = PAD + k * STEP, x1 = x0 + W, xm = x0 + W / 2, grp = mk("g", {}, g);
    mk("path", { d: poly([P(x0, Y, Z0), P(x1, Y, Z0), P(x1, Y, Z1), P(x0, Y, Z1)]) + seg(P(xm, Y, Z0), P(xm, Y, Z1)) + seg(P(x0, Y, (Z0 + Z1) / 2), P(x1, Y, (Z0 + Z1) / 2)), class: "nf lo" }, grp);
    const [sr, si] = rings(x0 - 3, Y, x1 + 3, Y + 4, 1, 0.6);
    put(solid(grp), prism(P, front, sr, si, Z0 - 2.5, Z0));
    const leaves = [0, 1].map(() => ({ sil: mk("path", { class: "sil" }, grp), lou: mk("path", { class: "nf lo" }, grp) }));
    items.push({ k, x0, x1, leaves, a: tween(REST[k]), last: NaN });
  }

  function leaf(l, hx, dir, deg) {
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)), w = W / 2 - 0.4, pts = [];
    const at = (u, t, z) => P(hx + dir * (u * c - t * s), Y + 0.3 + u * s + t * c, z);
    for (const u of [0, w]) for (const t of [0, T]) for (const z of [Z0 + 0.5, Z1 - 0.5]) pts.push(at(u, t, z));
    const h = hull(pts);
    l.sil.setAttribute("d", poly(fillet(h, h.map(() => 1.2))));
    let d = "";
    for (let i = 1; i < 6; i++) { const z = lerpZ(i / 6); d += seg(at(1.5, T, z), at(w - 1.5, T, z)); }
    l.lou.setAttribute("d", d);
  }
  const lerpZ = (t) => Z0 + (Z1 - Z0) * t;

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    leaf(it.leaves[0], it.x0, 1, deg);
    leaf(it.leaves[1], it.x1, -1, deg);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, Y, (Z0 + Z1) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? REST[k] : dd === 0 ? OPEN : dd === 1 ? 22 : 4;
      tset(it.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      for (const l of it.leaves) l.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "win " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "windowshutters",
  means: "A house wall with three windows: the shutters under the pointer swing open, and the windows beside it open a crack.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[144, 85], [205, 115], [266, 145], null],
  mount,
});
