/**
 * Pressure cooker: a round pot with a long side handle, and a locking lid
 * with its own long handle and a steam valve. The pointer over the pot
 * unlocks the lid: it twists its handle away from the pot's handle and
 * lifts clear of the rim. At rest the lid sits a touch unlocked, bright.
 * The slider is how far the lid lifts.
 *
 * The pattern: one part answering (a twist and a lift on the discrete
 * clock); the hit is on the pot's rest box, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 30, PT = 30, LT = 7, REST = [3, 14];
const turn = (ring, a, dx, dy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: (q.u + dx) * c - (q.v + dy) * s, v: (q.u + dx) * s + (q.v + dy) * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = clamp(value, 12, 40);
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-R, -R, 0], [R + 36, R, 0], [R + 36, -6, 0], [-R, R, 0], [-R, -R, PT + 40 + LT + 10], [R + 36, 6, PT + 46]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the pot, its rim bead, and its long side handle
  put(solid(g), prism(P, front, circ(R, 64), circ(R - 1.6, 64), 0, PT));
  mk("path", { class: "nf lo", d: poly(ringAt(P, circ(R, 64), PT - 4)) }, g);
  const [hr, hi] = rings(R - 2, -4, R + 34, 4, 3.5, 1.2);
  put(solid(g), prism(P, front, hr, hi, PT - 7, PT - 2));

  // the lid: a low dome, its handle, the valve
  const lid = solid(g), hand = solid(g), valve = solid(g);
  const lz = tween(REST[0]), la = tween(REST[1]);
  const LH = rings(R - 4, -4, R + 32, 4, 3.5, 1.2), VR = [circ(3.4, 24), circ(2.4, 24)];
  let last = "";
  function draw(z, a) {
    const key = z.toFixed(2) + a.toFixed(2);
    if (key === last) return;
    last = key;
    const t = a * (Math.PI / 180), z0 = PT + z;
    lid.sil.setAttribute("d", poly(hull(ringAt(P, circ(R + 1, 64), z0).concat(ringAt(P, circ(R - 9, 48), z0 + LT)))));
    lid.cr.setAttribute("d", poly(ringAt(P, circ(R - 10.4, 48), z0 + LT)) + poly(ringAt(P, turn(rrect(R - 3, -3, R + 2, 3, 1.2, 4), t + 2.6, 0, 0), z0 + 1.5)));
    put(hand, prism(P, front, turn(LH[0], t, 0, 0), turn(LH[1], t, 0, 0), z0 + 1, z0 + 5.5));
    put(valve, prism(P, front, turn(VR[0], t, -8, -6), turn(VR[1], t, -8, -6), z0 + LT - 1, z0 + LT + 7));
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(lz, now), tval(la, now));
    return !(tdone(lz, now) && tdone(la, now));
  });
  bag.add(B.unregister);

  // the hit: the pot's rest box on screen
  const c0 = P(0, 0, 0), c1 = P(0, 0, PT + LT);
  function hit([sx, sy]) {
    return Math.abs(sx - c0[0]) < 110 && sy > c1[1] - 50 && sy < c0[1] + 50 ? 1 : -1;
  }

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now();
    act = a;
    tset(la, a < 0 ? REST[1] : 70, now, 0);
    tset(lz, a < 0 ? REST[0] : lift, now, 60);
    lid.sil.classList.add("hi");
    read.textContent = a < 0 ? "rest" : "open";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = clamp(v, 12, 40); setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "pressurecooker",
  means: "A pressure cooker: the pointer unlocks the lid, which twists its handle off the pot's handle and lifts clear of the rim.",
  rules: [1, 3, 5, 6],
  range: [12, 26, 40],
  tour: [[189, 166], [189, 221], [230, 190], null],
  mount,
});
