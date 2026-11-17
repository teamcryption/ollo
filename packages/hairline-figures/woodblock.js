/**
 * Temple block: a hollow wooden block on a felt pad, a slit cut across its
 * face, and a mallet resting raised beside it. The pointer over the figure
 * swings the mallet down onto the block; the slider is how far it swings.
 * At rest the mallet head is the bright mark.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rings, ringAt, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const GX = 78, GY = 14, GZ = 12, L = 52, HR = 8, A0 = 1.75, A1 = 2.79;
const ball = (P, x, y, z, r) => {
  const pts = [];
  for (let i = -3; i <= 3; i++) { const t = (i / 3) * (Math.PI / 2); pts.push(...ringAt(P, circ(r * Math.cos(t) + 0.01, 20).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), z + r * Math.sin(t))); }
  return hull(pts);
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[-4, -4, 0], [GX + 6, 32, 0], [GX + 6, -4, 0], [-4, 32, 0], [GX + L * Math.cos(A0), GY, GZ + L * Math.sin(A0) + HR]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-4, -4, 46, 32, 6, 1.5);
  put(solid(g), prism(P, front, pr, pi, 0, 3));
  const blk = solid(g), [br, bi] = rings(0, 0, 42, 28, 12, 2);
  put(blk, prism(P, front, br, bi, 3, 26));
  mk("path", { class: "nf", d: poly(ringAt(P, rrect(8, 12, 34, 16, 2, 4), 26)) + seg(P(42, 8, 10), P(42, 20, 10)) }, blk.g);
  const mg = mk("g", {}, g), handle = mk("path", { class: "sil" }, mg), head = mk("path", { class: "sil hi" }, mg);
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const a = A0 + (A1 - A0) * v, hx = GX + L * Math.cos(a), hz = GZ + L * Math.sin(a);
    const h0 = ball(P, GX, GY, GZ, 2.2), h1 = ball(P, hx, GY, hz, 1.6);
    handle.setAttribute("d", poly(hull(h0.concat(h1))));
    head.setAttribute("d", poly(ball(P, hx, GY, hz, HR)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? amt : 0, performance.now(), 0);
    read.textContent = a ? "tok" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: () => setActive(true), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(t, amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "woodblock",
  means: "A temple block on its pad: the pointer swings the raised mallet down onto the block's slit top.",
  rules: [1, 3, 4, 5],
  range: [0.3, 1, 1],
  tour: [[178, 87], [143, 77], [174, 215], null],
  mount,
});
