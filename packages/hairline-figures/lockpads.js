/**
 * Lab stools: a row of round lab stools, each a weighted foot, a gas-lift
 * post and a round seat. The pointer picks a stool by where it is along the
 * row: its seat rises on the post, the others lift a little, staggered from
 * it. At rest the seats stand at uneven heights, one bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row; the hit is the nearest resting
 * centre by screen x, inside the row's fixed band.
 */
const {
  Cam, circ, clamp, facing, fit, prism, proj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 22, X0 = 0, R = 7.5, FOOT = 6;
const REST = [24, 31, 21, 27], FAV = 1, LIFT = 38, BUMP = 3;

function at(ring, x, y) { return ring.map((s) => ({ ...s, u: s.u + x, v: s.v + y })); }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const XE = X0 + (N - 1) * STEP;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[-R, -R, 0], [XE + R, R, 0], [-R, R, 0], [XE + R, -R, LIFT + 3], [-R, -R, LIFT + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const stools = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    const foot = solid(grp), post = solid(grp), ring = solid(grp), seat = solid(grp);
    put(foot, prism(P, front, at(circ(FOOT, 24), x, 0), at(circ(FOOT - 1, 24), x, 0), 0, 1.6));
    stools.push({ x, post, ring, seat, z: tween(REST[k]), last: NaN });
  }

  function draw(s, z) {
    if (z === s.last) return;
    s.last = z;
    put(s.post, prism(P, front, at(circ(1.3, 16), s.x, 0), at(circ(0.7, 16), s.x, 0), 1.6, z));
    const fz = Math.min(12, z - 6);
    put(s.ring, prism(P, front, at(circ(5, 24), s.x, 0), at(circ(4.2, 24), s.x, 0), fz, fz + 0.8));
    put(s.seat, prism(P, front, at(circ(R, 28), s.x, 0), at(circ(R - 1.2, 28), s.x, 0), z, z + 3));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    stools.forEach((s) => { draw(s, tval(s.z, now)); if (!tdone(s.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest resting centre by screen x, inside the band the row rests in
  const cx = stools.map((s, k) => P(s.x, 0, REST[k] / 2)[0]);
  function hit([sx, sy]) {
    let best = 0;
    cx.forEach((c, k) => { if (Math.abs(sx - c) < Math.abs(sx - cx[best])) best = k; });
    const s = stools[best], top = P(s.x, 0, LIFT + 3)[1] - 12, bot = P(s.x, 0, 0)[1] + 16;
    if (Math.abs(sx - cx[best]) > 24 || sy < top || sy > bot) return -1;
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    stools.forEach((s, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : clamp(REST[k] + BUMP - Math.abs(k - a), REST[k], LIFT - 3);
      tset(s.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.seat.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "stool " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "lockpads",
  means: "A row of lab stools: the seat under the pointer rises on its post, the neighbouring seats lift a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[121, 128], [226, 181], [279, 207], null],
  mount,
});
