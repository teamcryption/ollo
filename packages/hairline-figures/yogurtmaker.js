/**
 * Yogurt maker: a round warming base holding seven jars, each with its own
 * cap, under a clear dome lid with a knob. The pointer over the machine
 * lifts the dome straight off the base to show the jars. At rest the dome
 * sits raised a little over the jar caps, bright. The slider is how high the dome lifts.
 *
 * The pattern: one part answering (a lift on the discrete clock); the hit
 * is on the machine's rest box, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 34, BZ = 9, JR = 6.2, JH = 17, DH = 30, REST = 12;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = clamp(value, 18, 48);
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [-R * 0.7, -R * 0.7, BZ + 48 + DH + 5], [R * 0.7, R * 0.7, BZ + 48 + DH + 5]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the warming base, a dial dot on its face toward us
  put(solid(g), prism(P, front, circ(R, 64), circ(R - 2, 64), 0, BZ));
  mk("path", { class: "nf lo", d: poly(ringAt(P, circ(R - 5, 64), BZ)) }, g);

  // the jars, far to near, each with its cap
  const spots = [[0, 0]];
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + 0.3; spots.push([18 * Math.cos(a), 18 * Math.sin(a)]); }
  spots.sort((p, q) => p[0] + p[1] - (q[0] + q[1]));
  for (const [x, y] of spots) {
    put(solid(g), prism(P, front, disc(x, y, JR), disc(x, y, JR - 1.2), BZ, BZ + JH));
    put(solid(g), prism(P, front, disc(x, y, JR + 0.4), disc(x, y, JR - 0.8), BZ + JH, BZ + JH + 3));
  }

  // the dome: a clear cover, its rim band and its knob
  const dome = mk("path", { class: "sil" }, g), band = mk("path", { class: "nf lo" }, g), knob = mk("path", { class: "nf" }, g);
  const lz = tween(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    const base = BZ + z, pts = ringAt(P, circ(R - 1, 64), base);
    for (let i = 0; i <= 8; i++) { const t = (i / 8) * (Math.PI / 2); pts.push(...ringAt(P, circ((R - 1) * Math.cos(t) + 0.01, 48), base + 4 + DH * Math.sin(t))); }
    dome.setAttribute("d", poly(hull(pts)));
    band.setAttribute("d", poly(ringAt(P, circ(R - 1, 64), base + 4)));
    const top = base + 4 + DH;
    knob.setAttribute("d", poly(hull(ringAt(P, circ(4, 20), top - 1).concat(ringAt(P, circ(4, 20), top + 4)))));
  }

  const B = register(stage, (_dt, now) => { draw(tval(lz, now)); return !tdone(lz, now); });
  bag.add(B.unregister);

  // the hit: the machine's rest box on screen
  const c0 = P(0, 0, 0), c1 = P(0, 0, BZ + DH + 8);
  function hit([sx, sy]) {
    return Math.abs(sx - c0[0]) < 100 && sy > c1[1] - 40 && sy < c0[1] + 50 ? 1 : -1;
  }

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(lz, a < 0 ? REST : lift, performance.now(), 0);
    dome.classList.add("hi");
    read.textContent = a < 0 ? "rest" : "jars";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = clamp(v, 18, 48); setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "yogurtmaker",
  means: "A yogurt maker: the pointer lifts the clear dome straight off the warming base to show the seven capped jars inside.",
  rules: [1, 3, 5, 6],
  range: [18, 33, 48],
  tour: [[200, 162], [200, 250], [160, 200], null],
  mount,
});
