/**
 * Chime bars: a stand of six metal tubes, longest to shortest, each hung on a
 * short cord from a rail held up by two posts on a base. The pointer picks a
 * tube by where it is along the row: that tube swings out towards the viewer,
 * its neighbours sway after it, staggered by distance. At rest the tubes hang
 * with a slight uneven lean, one lit. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is the nearest rest
 * centre along screen x.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rad, rings, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, X0 = 6, STEP = 10, ZR = 84, CORD = 7, R = 2.7, SWING = 30;
const LEN = [56, 50, 44, 38, 33, 28];
const REST = [4, -2, 6, 1, -3, 3], FAV = 2;
const XE = X0 + (N - 1) * STEP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.15);
  const far = Math.sin(rad(SWING)) * (CORD + LEN[0]);
  fit(C, [[-12, -12, 0], [XE + 12, 12, 0], [-12, 12, 0], [XE + 12, -12, 0], [-8, -2, ZR + 4], [XE + 8, 2, ZR + 4], [X0, far, 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [bo, bi] = rings(-12, -12, XE + 12, 12, 7, 1.4);
  put(solid(g), prism(P, front, bo, bi, 0, 4));
  function post(x) {
    const [o, i] = rings(x - 2.2, -2.2, x + 2.2, 2.2, 2, 0.6);
    put(solid(g), prism(P, front, o, i, 4, ZR));
  }
  post(-6);

  const tubes = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    tubes.push({
      k, x: X0 + k * STEP, L: LEN[k], a: tween(REST[k]), last: NaN,
      cord: mk("path", { class: "nf lo" }, grp), sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp),
    });
  }
  post(XE + 6);
  const [ro, ri] = rings(-9, -2.6, XE + 9, 2.6, 2.4, 0.8);
  put(solid(g), prism(P, front, ro, ri, ZR, ZR + 4));

  const ring = circ(R, 16);
  function at(cx, cy, z, ring0) { return ring0.map((s) => P(cx + s.u, cy + s.v, z)); }
  function draw(t, deg) {
    if (deg === t.last) return;
    t.last = deg;
    const sa = Math.sin(rad(deg)), ca = Math.cos(rad(deg));
    const y0 = CORD * sa, z0 = ZR - CORD * ca, y1 = (CORD + t.L) * sa, z1 = ZR - (CORD + t.L) * ca;
    t.cord.setAttribute("d", open([P(t.x, 0, ZR), P(t.x, y0, z0)]));
    t.sil.setAttribute("d", poly(hull(at(t.x, y0, z0, ring).concat(at(t.x, y1, z1, ring)))));
    t.cr.setAttribute("d", open(at(t.x, y0, z0, run(ring, front))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    tubes.forEach((t) => { draw(t, tval(t.a, now)); if (!tdone(t.a, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest rest centre along screen x, inside the stand's band
  const cx = tubes.map((t) => P(t.x, 0, ZR - CORD - t.L / 2)[0]);
  const top = P(0, 0, ZR + 4)[1], left = P(-12, 0, 0)[0], right = P(XE + 12, 0, 0)[0];
  const bot = P(XE, 12, 0)[1];
  function hit([sx, sy]) {
    if (sx < left || sx > right || sy < top - 6 || sy > bot) return -1;
    let best = 0;
    cx.forEach((c, k) => { if (Math.abs(sx - c) < Math.abs(sx - cx[best])) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    tubes.forEach((t, k) => {
      const d = from < 0 ? 0 : Math.abs(k - from);
      const deg = a < 0 ? REST[k] : SWING * Math.max(0.1, 1 - Math.abs(k - a) / 3);
      tset(t.a, deg, now, d * stag);
      t.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bar " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "panflute",
  means: "A stand of chime bars: the tube under the pointer swings out on its cord and its neighbours sway after it, by distance.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[198, 148], [168, 133], [244, 152], null],
  mount,
});
