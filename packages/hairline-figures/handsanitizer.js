/**
 * Sanitizer stand: a floor stand, a pole, and a square bottle with a pump on
 * a turntable cradle. The pointer over the stand turns the bottle round so
 * the pump's nozzle swings toward the reader; at rest it stands half turned,
 * the bottle bright. The slider is how far it turns.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, circ, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PH = 70, BW = 30, BD = 18, BT = 56, REST = 25;
const disc = (r, n = 24) => circ(r, n);
const rot = (ring, a) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let turn = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-36, -36, 0], [36, 36, 0], [36, -36, 0], [-36, 36, 0], [0, 0, PH + 4 + BT + 16]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-36, -36, 36, 36, 12, 2);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  mk("path", { d: poly(ringAt(P, disc(10, 20), 4)), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(3.2), disc(2), 4, PH));
  const parts = [
    { ring: rrect(-18, -14, 18, 14, 6, 4), inner: rrect(-16, -12, 16, 12, 4, 4), z0: PH, z1: PH + 4 },
    { ring: rrect(-BW / 2, -BD / 2, BW / 2, BD / 2, 6, 4), inner: rrect(-BW / 2 + 2, -BD / 2 + 2, BW / 2 - 2, BD / 2 - 2, 4, 4), z0: PH + 4, z1: PH + 4 + BT, hi: true },
    { ring: disc(4.5, 16), inner: disc(3, 16), z0: PH + 4 + BT, z1: PH + 4 + BT + 6 },
    { ring: disc(2, 12), inner: disc(1, 12), z0: PH + 10 + BT, z1: PH + 14 + BT },
    { ring: rrect(-4, -4, 20, 4, 3, 4), inner: rrect(-2.5, -2.5, 18.5, 2.5, 2, 4), z0: PH + 14 + BT, z1: PH + 19 + BT },
  ].map((p) => ({ ...p, s: solid(g) }));
  const bottle = parts[1].s;
  const label = mk("path", { class: "nf lo" }, bottle.g);
  const ang = tween(REST * turn);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const t = (a * Math.PI) / 180;
    for (const p of parts) put(p.s, prism(P, front, rot(p.ring, t), rot(p.inner, t), p.z0, p.z1));
    // a window strip on the bottle's front face: the level it holds
    const fx = BW / 2, pts = [[fx, -5, PH + 14], [fx, 5, PH + 14], [fx, 5, PH + 40], [fx, -5, PH + 40]].map(([u, v, z]) => { const c = Math.cos(t), s = Math.sin(t); return P(u * c - v * s, u * s + v * c, z); });
    label.setAttribute("d", Math.cos(t - Math.PI / 4) > 0.15 ? poly(pts) : "");
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const c0 = P(0, 0, 0), c1 = P(0, 0, PH + BT + 20);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a ? REST * turn + 120 * turn : REST * turn, performance.now(), 0);
    bottle.sil.classList.add("hi");
    read.textContent = a ? "pump" : "rest";
    B.wake();
  }
  const hit = ([sx, sy]) => Math.abs(sx - c0[0]) < 70 && sy < c0[1] + 40 && sy > c1[1] - 10;
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { turn = v; act = null; }, destroy: bag.dispose };
}

hairline({
  name: "handsanitizer",
  means: "A sanitizer stand: the pointer over it turns the pump bottle on its cradle so the nozzle swings round to the reader.",
  rules: [1, 4, 5, 9],
  range: [0.4, 1, 1],
  tour: [[200, 120], [200, 200], [210, 80], null],
  mount,
});
