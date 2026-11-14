/**
 * Life rings: four buoys hanging on posts along a dock edge. The pointer picks
 * a ring by where it stands: that ring lifts off its peg, ready to throw, and
 * the rings beside it rise a little, staggered from it. At rest one ring is
 * raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, open, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 44, R = 17, RI = 8, T = 5, LIFT = 20, FAV = 2, CZ = 5, H = 46;
const X1 = (N - 1) * STEP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-R - 8, -14, 0], [X1 + R + 8, 16, 0], [-R - 8, 16, 0], [X1 + R + 8, -14, 0], [0, 0, CZ + H + LIFT + 4], [X1, 0, CZ + H + LIFT + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-R - 8, -14, X1 + R + 8, 16, 4, 2);
  put(solid(g), prism(P, front, dr, di, 0, CZ));
  // deck planks: dim seams on the dock top
  let seams = "";
  for (const y of [-6, 2, 9]) seams += open([P(-R - 6, y, CZ), P(X1 + R + 6, y, CZ)]);
  mk("path", { d: seams, class: "lo nf" }, g);

  const circle = (x, y, zc, r, n = 36) => {
    const out = [];
    for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; out.push(P(x + r * Math.cos(t), y, zc + r * Math.sin(t))); }
    return out;
  };
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const [pr, pi] = rings(x - 3, -10, x + 3, -4, 1.5, 0.8);
    put(solid(grp), prism(P, front, pr, pi, CZ, CZ + H + 4));
    // the peg the ring hangs from
    const [gr, gi] = rings(x - 1.6, -4, x + 1.6, 2, 0.8, 0.5);
    put(solid(grp), prism(P, front, gr, gi, CZ + H - 2, CZ + H + 1));
    const ring = mk("path", { class: "sil", "fill-rule": "evenodd" }, grp);
    const cr = mk("path", { class: "nf lo" }, grp), bands = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, grp, ring, cr, bands, z: tween(k === FAV ? LIFT * 0.75 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const zc = CZ + H - R + 2 + lift, x = it.x, yf = 3, yb = yf - T;
    const outer = hull(circle(x, yb, zc, R).concat(circle(x, yf, zc, R)));
    const hole = circle(x, yf, zc, RI);
    it.ring.setAttribute("d", poly(outer) + poly(hole));
    it.cr.setAttribute("d", poly(circle(x, yf, zc, R - 1.6)));
    let d = "";
    for (const a of [0.25, 0.75, 1.25, 1.75]) {
      for (const da of [-0.12, 0.12]) {
        const t = (a + da) * Math.PI, c = Math.cos(t), s = Math.sin(t);
        d += open([P(x + RI * c, yf, zc + RI * s), P(x + (R - 1.6) * c, yf, zc + (R - 1.6) * s)]);
      }
    }
    it.bands.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, CZ + H - R));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.75 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.ring.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "ring " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "lifejackets",
  means: "Four life rings on dock posts: the ring under the pointer lifts off its peg, ready to throw, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[120, 122], [229, 174], [283, 201], null],
  mount,
});
