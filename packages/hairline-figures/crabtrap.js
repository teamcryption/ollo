/**
 * Crab pot: a square wire cage with a funnel mouth on one side and a hinged
 * mesh lid. Over the pot, the lid swings open on its back hinge to show the
 * bait cup inside. At rest the lid stands ajar, bright. The slider is how far
 * the lid opens.
 *
 * The pattern: one part on a hinge (cloches, lifted to a swing).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, rrect, ringAt, seg, tset, tval, tdone, tween, unproj,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const W = 70, D = 70, H = 30, T = 3, REST = 14;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, H + D * 0.75], [W, 0, H + D * 0.75], [0, D, H + T]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [br, bi] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // wire mesh on the near face, a funnel mouth on the right face
  let mesh = "";
  for (let x = 14; x < W; x += 14) mesh += seg(P(x, D, 3), P(x, D, H - 3));
  mesh += seg(P(4, D, H / 2), P(W - 4, D, H / 2));
  const mouth = [], throat = [];
  for (let i = 0; i < 24; i++) {
    const t = (i / 24) * Math.PI * 2;
    mouth.push(P(W, D / 2 + 11 * Math.cos(t), H / 2 + 9 * Math.sin(t)));
    throat.push(P(W, D / 2 + 4 * Math.cos(t), H / 2 + 3.5 * Math.sin(t)));
  }
  mk("path", { d: mesh, class: "nf lo" }, g);
  mk("path", { d: poly(mouth), class: "nf" }, g);
  mk("path", { d: poly(throat) + mouth.filter((_, i) => i % 6 === 0).map((m, i) => seg(m, throat[i * 6])).join(""), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(W / 2, D / 2, 9), H)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(W / 2, D / 2, 5), H + 2)), class: "nf lo" }, g);

  const lr = rrect(0, 0, W, D, 6, 4), li = rrect(3, 3, W - 3, D - 3, 3, 4);
  const lid = mk("g", {}, g);
  const lsil = mk("path", { class: "sil hi" }, lid), lcr = mk("path", { class: "nf lo" }, lid);
  const lmesh = mk("path", { class: "nf lo" }, lid);
  const L = (a) => (u, v, h) => P(u, v * Math.cos(a) - h * Math.sin(a), H + v * Math.sin(a) + h * Math.cos(a));
  const area = (pts) => pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const f = L(rad(deg)), lo = lr.map((q) => f(q.u, q.v, 0)), hi = lr.map((q) => f(q.u, q.v, T));
    lsil.setAttribute("d", poly(hull(lo.concat(hi))));
    const up = area(hi) * area(lr.map((q) => P(q.u, q.v, 0))) > 0, h = up ? T : 0;
    lcr.setAttribute("d", poly(li.map((q) => f(q.u, q.v, h))));
    let m = "";
    for (let u = 17.5; u < W; u += 17.5) m += seg(f(u, 4, h), f(u, D - 4, h));
    for (let v = 17.5; v < D; v += 17.5) m += seg(f(4, v, h), f(W - 4, v, h));
    lmesh.setAttribute("d", m);
  }

  const ang = tween(REST);
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const inside = (z, sx, sy) => { const [x, y] = unproj(C, sx, sy, z); return x > -6 && x < W + 6 && y > -6 && y < D + 6; };
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a ? maxA : REST, performance.now(), 0);
    read.textContent = a ? "lid" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(inside(H, sx, sy) || inside(0, sx, sy)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "crabtrap",
  means: "A wire crab pot with a funnel mouth: over the pot, its hinged mesh lid swings open on the back hinge to show the bait cup.",
  rules: [1, 4, 5, 8],
  range: [40, 70, 80],
  tour: [[200, 192], [200, 250], [160, 170], null],
  mount,
});
