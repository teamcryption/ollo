/**
 * Food processor: a rounded motor base with a pulse dial, a tall work bowl
 * with its handle, a flat lid, and on the lid a wide feed chute holding its
 * pusher. The pointer over the machine draws the pusher up out of the
 * chute, flange first. At rest the pusher stands a little proud, bright.
 * The slider is how far the pusher rises.
 *
 * The pattern: one part answering (a slide on the discrete clock); the hit
 * is on the machine's rest box, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 18, BT = 52, LZ = 55, CT = 76, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = clamp(value, 24, 56);
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-30, -30, 0], [30, 30, 0], [30, -30, 0], [-30, 30, 0], [-4, -22, CT + 10 + 56], [16, 0, CT + 10 + 56]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the motor base and its pulse dial on the face toward us
  const [br, bi] = rings(-30, -30, 30, 30, 11, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const dial = [];
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; dial.push(P(30, 5 * Math.cos(a), BZ / 2 + 4 * Math.sin(a))); }
  mk("path", { class: "nf lo", d: poly(dial) }, g);

  // the bowl with its handle on the near side, then the lid
  put(solid(g), prism(P, front, circ(25, 64), circ(23.6, 64), BZ, BT));
  const [hr, hi] = rings(-5, 22, 5, 34, 3, 1);
  put(solid(g), prism(P, front, hr, hi, BZ + 6, BT - 4));
  put(solid(g), prism(P, front, circ(26.5, 64), circ(24.5, 64), BT, LZ));

  // the feed chute, then the pusher standing in it
  const [cr, ci] = rings(-4, -22, 16, 0, 7, 1.3);
  put(solid(g), prism(P, front, cr, ci, LZ, CT));
  mk("path", { class: "nf lo", d: poly(ringAt(P, rings(-2.4, -20.4, 14.4, -1.6, 5.6, 1)[0], CT)) }, g);
  const stem = solid(g), cap = solid(g);
  const [sr, si] = rings(-2.4, -20.4, 14.4, -1.6, 5.6, 1), [fr, fi] = rings(-5.5, -23.5, 17.5, 1.5, 7.5, 1.4);
  const pz = tween(REST);
  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    put(stem, prism(P, front, sr, si, CT, CT + 4 + p));
    put(cap, prism(P, front, fr, fi, CT + 4 + p, CT + 7 + p));
  }

  const B = register(stage, (_dt, now) => { draw(tval(pz, now)); return !tdone(pz, now); });
  bag.add(B.unregister);

  // the hit: the machine's rest box on screen
  const c0 = P(0, 0, 0), c1 = P(0, 0, CT + 10);
  function hit([sx, sy]) {
    return Math.abs(sx - c0[0]) < 80 && sy > c1[1] - 40 && sy < c0[1] + 40 ? 1 : -1;
  }

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(pz, a < 0 ? REST : lift, performance.now(), 0);
    cap.sil.classList.add("hi");
    read.textContent = a < 0 ? "rest" : "feed";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = clamp(v, 24, 56); setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "foodprocessor2",
  means: "A food processor: the pointer draws the pusher up out of the wide feed chute on the lid, flange first.",
  rules: [1, 3, 5, 6],
  range: [24, 40, 56],
  tour: [[225, 120], [200, 200], [175, 240], null],
  mount,
});
