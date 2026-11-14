/**
 * Medicine balls: a low rack holding a row of medicine balls of rising
 * weight, each with a seam round its middle. The pointer picks a ball by
 * where it stands: it lifts off the rack, and the balls beside it rise a
 * little, staggered from it. At rest one ball sits raised, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RS = [11, 12.5, 14, 15.5, 17], N = RS.length, GAP = 5, LIFT = 24, FAV = 2, RZ = 8;
const XS = [];
{ let x = 0; RS.forEach((r, k) => { x += (k ? RS[k - 1] : 0) + r + (k ? GAP : 4); XS.push(x); }); }
const X1 = XS[N - 1] + RS[N - 1] + 4, W = 2 * RS[N - 1] + 4, YC = W / 2;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-4, -4, 0], [X1 + 4, W + 4, 0], [X1 + 4, -4, 0], [-4, W + 4, 0], [XS[0], YC, RZ + 2 * RS[0] + LIFT], [XS[N - 1], YC, RZ + 2 * RS[N - 1] + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the rack: two rails on short feet
  const rail = (y0, y1) => {
    for (const x of [2, X1 - 8]) { const [fr, fi] = rings(x, y0, x + 6, y1, 2, 1); put(solid(g), prism(P, front, fr, fi, 0, RZ - 3)); }
    const [rr, ri] = rings(-2, y0, X1 + 2, y1, 3, 1); put(solid(g), prism(P, front, rr, ri, RZ - 3, RZ));
  };
  rail(-2, 4);
  const bg = mk("g", {}, g);
  rail(W - 4, W + 2);

  const items = RS.map((r, k) => {
    const grp = mk("g", {}, bg);
    const ball = mk("path", { class: "sil" }, grp), seam = mk("path", { class: "nf lo" }, grp), seam2 = mk("path", { class: "nf lo" }, grp);
    return { k, r, x: XS[k], grp, ball, seam, seam2, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN };
  });

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const r = it.r, zc = RZ - r * 0.25 + r + lift, pts = [];
    for (let i = 0; i <= 8; i++) { const t = -Math.PI / 2 + (i / 8) * Math.PI; pts.push(...ringAt(P, disc(it.x, YC, r * Math.cos(t) + 0.01, 28), zc + r * Math.sin(t))); }
    it.ball.setAttribute("d", poly(hull(pts)));
    // two seams on the near side: the equator and one meridian
    const eq = [], mer = [];
    for (let i = 0; i <= 40; i++) {
      const t = -Math.PI / 2 + (i / 40) * 2 * Math.PI, c = Math.cos(t), sn = Math.sin(t);
      if (0.612 * (c + sn) > 0.05) eq.push(P(it.x + r * c, YC + r * sn, zc));
      if (0.612 * c + 0.5 * sn > 0.05) mer.push(P(it.x + r * c, YC, zc + r * sn));
    }
    it.seam.setAttribute("d", open(eq));
    it.seam2.setAttribute("d", open(mer));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, YC, RZ + it.r));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.ball.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : (4 + 2 * a) + " kg";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "medicineballs",
  means: "Medicine balls of rising weight on a low rack: the ball under the pointer lifts off, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 150], [200, 170], [250, 190], null],
  mount,
});
