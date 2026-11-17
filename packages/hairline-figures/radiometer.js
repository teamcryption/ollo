/**
 * Radiometer: three Crookes radiometers on a bench, glass bulbs on stems,
 * four vanes on a spindle in each. The pointer picks one by where it stands:
 * its vanes turn as if lit, and the vanes beside it turn a little,
 * staggered. At rest one set of vanes is bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 46, R = 19, ZC = 46, TURN = 50, FAV = 0, CZ = 3;
const X1 = (N - 1) * STEP + 2 * (R + 2);
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-4, -4, 0], [X1 + 4, 2 * R + 8, 0], [X1 + 4, -4, 0], [-4, 2 * R + 8, 0], [R + 2, R + 2, ZC + R + 6], [X1 - R - 2, R + 2, ZC + R + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, X1 + 4, 2 * R + 8, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, CZ));
  const cyl = (x, y, r, z0, z1) => poly(hull(ringAt(P, disc(x, y, r, 24), z0).concat(ringAt(P, disc(x, y, r, 24), z1))));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + 2 + k * STEP, y = R + 2, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, 11), disc(x, y, 9), CZ, CZ + 4));
    mk("path", { d: cyl(x, y, 3, CZ + 4, ZC - R + 2) }, grp);
    const sp = mk("path", { d: seg(P(x, y, ZC - 12), P(x, y, ZC + 10)), class: "lo nf" }, grp);
    const vanes = [0, 1, 2, 3].map(() => mk("path", {}, grp));
    const bp = [];
    for (let i = 0; i <= 12; i++) { const t = (i / 12) * Math.PI; bp.push(...ringAt(P, disc(x, y, R * Math.sin(t) + 0.01, 36), ZC - R * Math.cos(t))); }
    mk("path", { d: poly(hull(bp)), class: "sil nf" }, grp);
    mk("path", { d: cyl(x, y, 2, ZC + R - 1, ZC + R + 4), class: "nf" }, grp);
    items.push({ k, x, y, sp, vanes, a: tween(k === FAV ? 20 : 0), last: NaN });
  }

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const quads = [0, 1, 2, 3].map((j) => {
      const t = ((a + j * 90 + 15) * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t), w = 3.5;
      const px = -s * w, py = c * w, r1 = 4, r2 = 15, cx = it.x, cy = it.y;
      const pts = [[r1, -1], [r2, -1], [r2, 1], [r1, 1]].map(([r, sg]) => [cx + c * r + px * sg, cy + s * r + py * sg]);
      return { d: pts[0][0] + pts[1][0] + pts[0][1] + pts[1][1] - 2 * cx - 2 * cy, pts };
    });
    quads.sort((p, q) => p.d - q.d);
    quads.forEach((q, j) => {
      const [A, Bp] = q.pts;
      const ring = [P(A[0], A[1], ZC - 6), P(Bp[0], Bp[1], ZC - 6), P(Bp[0], Bp[1], ZC + 6), P(A[0], A[1], ZC + 6)];
      it.vanes[j].setAttribute("d", poly(ring));
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, ZC - 10));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 38 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? 20 : 0) : dd === 0 ? TURN : dd === 1 ? 25 : 0;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.vanes.forEach((v) => v.classList.toggle("hi", k === (a < 0 ? FAV : a)));
    });
    read.textContent = a < 0 ? "rest" : "bulb " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "radiometer",
  means: "Three Crookes radiometers on a bench: the vanes in the bulb under the pointer turn, and the vanes beside it turn a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[137, 120], [263, 180], [200, 150], null],
  mount,
});
