/**
 * Tennis rackets: four rackets stand on a wall rack, leaning back against its
 * rail, each an oval head strung with a grid, an open throat and a grip; a
 * ball tube stands at the end. The racket under the pointer tilts out toward
 * the reader and lifts off the rack, and its neighbours tilt a little,
 * staggered from it. At rest one racket is half out, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (bookshelf); the pick is the
 * racket whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, fit, hull, poly, prism, proj, facing, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, XS = [0, 27, 54, 81], Y0 = 6, FAV = 1;
const REST = [-5, 3, -7, -4], OUT = 19, LIFT = 6, NB = [6, 2];
const HC = 50, HA = 11, HB = 15, T = 2.4;
const ell = (a, b, n) => circ(1, n).map((q) => [q.u * a, HC + q.v * b]);
const HEAD = ell(HA, HB, 40), RIM = ell(HA - 1.6, HB - 1.6, 40);
const GRIP = rrect(-2.7, 0, 2.7, 25, 1.2, 3).map((q) => [q.u, q.v]);
const THROAT = [[-7.5, 39], [7.5, 39], [2.4, 23], [-2.4, 23]];
const inset = (pts, d) => {
  const cu = pts.reduce((s, p) => s + p[0], 0) / pts.length, cv = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map(([u, v]) => { const l = Math.hypot(u - cu, v - cv) || 1; return [u - ((u - cu) / l) * d, v - ((v - cv) / l) * d]; });
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-14, -4, -4], [114, 14, -4], [-14, -4, 66], [114, -4, 66], [-12, 34, 80], [92, 34, 80]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the rail behind, then the ledge the rackets stand on
  { const [r, i] = rings(-14, -4, 96, -1, 1.2, 0.6); put(solid(g), prism(P, front, r, i, 54, 59)); }
  { const [r, i] = rings(-14, -4, 114, 13, 2, 1); put(solid(g), prism(P, front, r, i, -4, 0)); }

  const rk = XS.map((x, k) => {
    const grp = mk("g", {}, g);
    const grip = solid(grp), throat = solid(grp), head = solid(grp);
    const str = mk("path", { class: "nf lo" }, grp);
    return { k, x, grip, throat, head, str, th: tween(REST[k]), z: tween(0), last: "" };
  });
  { const [r] = rings(100, 1, 109, 10, 4.5, 1); put(solid(g), prism(P, front, r, rings(101.2, 2.2, 107.8, 8.8, 3.3, 0.5)[0], 0, 36)); }

  function draw(b, deg, lift) {
    const key = deg.toFixed(2) + "," + lift.toFixed(2);
    if (key === b.last) return false;
    b.last = key;
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const X = (u, v, w) => P(b.x + u, Y0 + w * c + v * s, lift + v * c - w * s);
    const slab = (el, pts, t, crease) => {
      const f = pts.map(([u, v]) => X(u, v, t / 2)), bk = pts.map(([u, v]) => X(u, v, -t / 2));
      el.sil.setAttribute("d", poly(hull(f.concat(bk))));
      el.cr.setAttribute("d", poly(crease.map(([u, v]) => X(u, v, t / 2))));
    };
    slab(b.grip, GRIP, 3.6, inset(GRIP, 0.9));
    slab(b.throat, THROAT, T, inset(THROAT, 1.1));
    slab(b.head, HEAD, T, RIM);
    let d = "";
    for (let u = -6; u <= 6; u += 3) { const h = (HB - 2.2) * Math.sqrt(1 - (u / (HA - 2.2)) ** 2); d += seg(X(u, HC - h, T / 2), X(u, HC + h, T / 2)); }
    for (let v = -9; v <= 9; v += 3) { const h = (HA - 2.2) * Math.sqrt(1 - (v / (HB - 2.2)) ** 2); d += seg(X(-h, HC + v, T / 2), X(h, HC + v, T / 2)); }
    b.str.setAttribute("d", d);
    return true;
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of rk) { draw(b, tval(b.th, now), tval(b.z, now)); if (!tdone(b.th, now) || !tdone(b.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The racket whose resting middle is nearest the pointer's x on screen; -1 off the rack. */
  const mids = rk.map((b) => P(b.x, Y0, 34));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    rk.forEach((b, k) => {
      const d = Math.abs(k - a);
      const th = a < 0 ? REST[k] : d === 0 ? OUT : d <= 2 ? NB[d - 1] : REST[k];
      const delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(b.th, th, now, delay); tset(b.z, d === 0 ? LIFT : 0, now, delay);
      b.head.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "racket " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tennisrackets",
  means: "Four tennis rackets on a wall rack: the one under the pointer tilts out and lifts off, its neighbours tilt a little.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[178, 101], [139, 81], [257, 140], null],
  mount,
});
