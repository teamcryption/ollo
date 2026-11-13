/**
 * Gift wrap: a wrapping station, a bench with two posts and a rail, four rolls
 * of gift paper of different girths hung on the rail, a sheet hanging from
 * the front of each, and a ribbon spool at the bench's corner with its tail
 * laid out. The pointer is where the paper is pulled: the roll under it
 * unrolls a sheet toward the reader, and the rolls beside it unroll a little,
 * each on its own spring. At rest one sheet is half out, its roll bright. The
 * slider is how far the reach spreads.
 *
 * The pattern: a continuous falloff along one row (terrain's spring, per
 * roll); the pick is the roll whose resting middle is nearest the pointer's x.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, seg, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 32, L = 26, YC = 14, ZA = 34, RR = [9, 8, 9.5, 7.5], SMAX = 38, FAV = 2;
const REST = [3, 5, 15, 2], A = 0.87, CA = Math.cos(A), SA = Math.sin(A);
const XE = N * STEP + 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-12, -4, 0], [XE + 14, 64, 0], [XE + 14, -4, 0], [-12, 64, 0], [0, YC, ZA + 10], [XE, YC, ZA + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // a ring standing across x, round an axis along x
  const ringX = (x, y, z, r, n = 28) => circ(r, n).map((q) => P(x, y + q.u, z + q.v));
  const cylX = (x0, x1, y, z, r) => poly(hull(ringX(x0, y, z, r).concat(ringX(x1, y, z, r))));

  const [br, bi] = rings(-12, -4, XE + 14, 64, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  const post = (x) => put(solid(g), prism(P, front, circ(2, 20).map((q) => ({ ...q, u: q.u + x, v: q.v + YC })), null, 4, ZA + 2));
  post(-2);
  mk("path", { class: "sil", d: cylX(-4, XE, YC, ZA, 1.6) }, g);

  const rolls = [];
  for (let k = 0; k < N; k++) {
    const x0 = 6 + k * STEP, x1 = x0 + L, r = RR[k], el = mk("g", {}, g);
    const body = mk("path", { class: "sil", d: cylX(x0, x1, YC, ZA, r) }, el);
    mk("path", { class: "nf lo", d: poly(ringX(x1, YC, ZA, r - 1.2)) + poly(ringX(x1, YC, ZA, 2.6, 16)) }, el);
    rolls.push({ k, x0, x1, r, body, sp: spring(REST[k]), last: NaN });
  }
  for (const it of rolls) {
    it.sheet = mk("path", {}, g);
    it.edge = mk("path", { class: "nf lo" }, g);
  }
  post(XE);
  // the ribbon spool and its tail, flat on the bench
  put(solid(g), prism(P, front, circ(7, 40).map((q) => ({ ...q, u: q.u + XE + 2, v: q.v + 50 })), circ(5.8, 40).map((q) => ({ ...q, u: q.u + XE + 2, v: q.v + 50 })), 4, 11));
  place(flatDot(g, C, 1.6, "dot off"), P(XE + 2, 50, 11));
  mk("path", { class: "nf", d: poly([[XE - 5, 49, 4.2], [XE - 30, 55, 4.2], [XE - 31, 58, 4.2], [XE - 5, 52, 4.2]].map((p) => P(...p))) }, g);

  function draw(it) {
    const s = it.sp.x;
    if (Math.abs(s - it.last) < 0.02) return;
    it.last = s;
    const y0 = YC + it.r, a = [it.x0 + 1, y0, ZA], b = [it.x1 - 1, y0, ZA];
    const end = (p) => [p[0], p[1] + s * CA, p[2] - s * SA];
    const c = end(b), d = end(a);
    it.sheet.setAttribute("d", poly([a, b, c, d].map((p) => P(...p))));
    it.edge.setAttribute("d", seg(P(d[0], d[1] - 0.6, d[2] - 1), P(c[0], c[1] - 0.6, c[2] - 1)));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const it of rolls) { if (stepS(it.sp, dt)) m = true; draw(it); }
    return m;
  });
  bag.add(B.unregister);

  const mids = rolls.map((it) => P((it.x0 + it.x1) / 2, YC, ZA));
  const span = Math.abs(mids[1][0] - mids[0][0]);
  function aim(p) {
    let best = -1, bd = Infinity;
    if (p) mids.forEach((m, k) => { const dd = Math.abs(m[0] - p[0]); if (dd < bd) { bd = dd; best = k; } });
    if (best >= 0 && (bd > span * 0.8 || Math.abs(mids[best][1] - p[1]) > 70)) best = -1;
    rolls.forEach((it, k) => {
      let t = REST[k];
      if (best >= 0) {
        const dn = Math.abs(mids[k][0] - p[0]) / span, f = Math.max(0.08, Math.exp(-(dn * dn) / (0.5 * reach * reach)));
        t = clamp(SMAX * f, 2, SMAX);
      }
      it.sp.t = t;
      it.body.classList.toggle("hi", k === (best < 0 ? FAV : best));
    });
    read.textContent = best < 0 ? "rest" : "roll " + (best + 1);
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "giftwrap",
  means: "Four gift-paper rolls on a rail: the roll under the pointer unrolls a sheet toward you, and its neighbours unroll a little.",
  rules: [1, 3, 5, 8],
  range: [0.6, 1, 1.6],
  tour: [[153, 90], [197, 112], [285, 156], null],
  mount,
});
