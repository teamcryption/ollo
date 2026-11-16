/**
 * Incentive spirometer: three clear chambers on a base, a ball in each. The
 * pointer picks a chamber by its screen x: its ball rises to the top and the
 * balls beside it rise less, staggered from it. At rest the first ball floats
 * halfway, bright. The slider is the stagger.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, ringAt, circ, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 24, TR = 11, BR = 10, Z0 = 6, TH = 50;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  const X1 = (N - 1) * STEP + 2 * TR + 8;
  fit(C, [[-4, -4, 0], [X1, 2 * TR + 8, 0], [X1, -4, 0], [-4, 2 * TR + 8, 0], [TR, TR, Z0 + TH + 4], [X1 - TR, TR, Z0 + TH + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, X1, 2 * TR + 8, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, Z0));
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = TR + 4 + k * STEP, y = TR + 4, grp = mk("g", {}, g);
    const ball = mk("path", { class: "nf" }, grp), bcr = mk("path", { class: "nf lo" }, grp);
    const tube = solid(grp);
    put(tube, prism(P, front, disc(x, y, TR), disc(x, y, TR - 1.5), Z0, Z0 + TH));
    tube.sil.classList.add("nf");
    items.push({ k, x, y, ball, bcr, z: tween(k === 0 ? 0.75 : k === 1 ? 0.25 : 0), last: NaN });
  }
  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    const c = P(it.x, it.y, Z0 + BR + h * (TH - 2 * BR)), r = BR * C.S;
    const pts = (rr) => Array.from({ length: 28 }, (_, i) => [c[0] + rr * Math.cos((i / 28) * 6.2832), c[1] + rr * Math.sin((i / 28) * 6.2832)]);
    it.ball.setAttribute("d", poly(pts(r)));
    it.bcr.setAttribute("d", poly(pts(r * 0.55)));
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);
  const mids = items.map((it) => P(it.x, it.y, Z0 + TH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), h = a < 0 ? (k === 0 ? 0.75 : k === 1 ? 0.25 : 0) : d === 0 ? 1 : d === 1 ? 0.4 : 0.1;
      tset(it.z, h, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.ball.classList.toggle("hi", k === (a < 0 ? 0 : a));
    });
    read.textContent = a < 0 ? "rest" : "ball " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "incentive",
  means: "An incentive spirometer: the pointer picks a chamber and its ball rises to the top, the balls beside it rising less.",
  rules: [1, 2, 4, 5],
  range: [0, 45, 90],
  tour: [[158, 120], [200, 133], [242, 146], null],
  mount,
});
