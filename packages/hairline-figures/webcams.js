/**
 * Webcams: four small cameras on stands along a desk. Every camera pans to
 * face the point under the pointer, each on its own spring; the one nearest
 * the pointer takes the bright edge. At rest they look in slightly different
 * directions and one is bright. The slider is how far they may turn.
 *
 * The pattern: parts turning to face the pointer.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 36, CZ = 4, SH = 12, BZ = 10, FAV = 2;
const X1 = (N - 1) * STEP;
const REST = [62, 30, 52, 20];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rot = (ring, x, y, th) => {
  const c = Math.cos(th), s = Math.sin(th);
  return ring.map((q) => ({ u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-16, -16, 0], [X1 + 16, 16, 0], [X1 + 16, -16, 0], [-16, 16, 0], [0, 0, CZ + SH + BZ + 2], [X1, 0, CZ + SH + BZ + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-16, -16, X1 + 16, 16, 6, 2);
  put(solid(g), prism(P, front, dr, di, 0, CZ));
  const [br, bi] = rings(-4.5, -10, 4.5, 10, 3.2, 1.2);

  const cams = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, y = 0, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, 7), disc(x, y, 5.5), CZ, CZ + 1.5));
    put(solid(grp), prism(P, front, disc(x, y, 1.6, 12), disc(x, y, 1, 12), CZ + 1.5, CZ + SH));
    const body = solid(grp);
    const lens = mk("path", { class: "nf" }, grp), glass = mk("path", { class: "nf lo" }, grp);
    cams.push({ k, x, y, body, lens, glass, a: spring(rad(REST[k])), last: NaN });
  }

  function lensRing(it, th, R, out) {
    const c = Math.cos(th), s = Math.sin(th), pts = [], zc = CZ + SH + BZ / 2 + 0.6;
    for (let i = 0; i < 24; i++) {
      const t = (i / 24) * Math.PI * 2, w = R * Math.cos(t);
      pts.push(P(it.x + c * (4.5 + out) - s * w, it.y + s * (4.5 + out) + c * w, zc + R * Math.sin(t)));
    }
    return pts;
  }

  function draw(it) {
    const th = it.a.x;
    if (Math.abs(th - it.last) < 1e-4) return;
    it.last = th;
    put(it.body, prism(P, front, rot(br, it.x, it.y, th), rot(bi, it.x, it.y, th), CZ + SH, CZ + SH + BZ));
    it.lens.setAttribute("d", poly(hull(lensRing(it, th, 3.6, 0).concat(lensRing(it, th, 3.6, 1.6)))));
    it.glass.setAttribute("d", poly(lensRing(it, th, 2, 1.6)));
  }

  const B = register(stage, (dt) => {
    let moving = false;
    for (const it of cams) { if (stepS(it.a, dt)) moving = true; draw(it); }
    return moving;
  });
  bag.add(B.unregister);

  const mids = cams.map((it) => P(it.x, it.y, CZ + SH));
  let act = -2;
  function aim(p) {
    let best = -1, bd = Infinity;
    if (p) mids.forEach((m, k) => { const dd = Math.abs(m[0] - p[0]); if (dd < bd) { bd = dd; best = k; } });
    const a = p && bd < 30 && Math.abs(mids[best][1] - p[1]) < 70 ? best : -1;
    const g0 = p ? unproj(C, p[0], p[1], 0) : null;
    const lim = 25 + reach;
    cams.forEach((it, k) => {
      const want = g0 ? Math.atan2(g0[1] - it.y + 30, g0[0] - it.x + 30) : rad(REST[k]);
      it.a.t = clamp(want, rad(45 - lim), rad(45 + lim));
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    if (a !== act || a >= 0) read.textContent = a < 0 ? "rest" : "cam " + (a + 1) + " " + Math.round((cams[a].a.t * 180) / Math.PI - 45) + "°";
    act = a;
    B.wake();
  }
  cams.forEach(draw);
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "webcams",
  means: "Four webcams on a desk: each pans on its stand to face the pointer, and the one nearest it takes the bright edge.",
  rules: [1, 3, 5, 8],
  range: [10, 45, 70],
  tour: [[118, 102], [173, 129], [282, 184], null],
  mount,
});
