/**
 * Spice carousel: a round turntable base, a centre post with a carry knob,
 * and six capped jars standing round it. The pointer picks the jar nearest
 * it on the turntable: that jar lifts clear, its neighbours rise a little,
 * staggered round the ring. At rest the jars sit unevenly, one bright.
 *
 * The pattern: one of many on a ring; the hit is each jar's rest centre on a
 * fixed plane through the jars' middles.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, rrect, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, RB = 30, RJ = 19, JR = 6, JH = 14, CH = 4, BASE = 4, POST = 34, LIFT = 13, BUMP = 4;
const REST = [1, 0, 3, 0.5, 2, 0], FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[-RB, -RB, 0], [RB, RB, 0], [RB, -RB, 0], [-RB, RB, 0], [0, 0, POST + 4], [-RJ, 0, BASE + JH + CH + LIFT], [0, -RJ, BASE + JH + CH + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the turntable: a large round, built with more steps
  const base = solid(g);
  put(base, prism(P, front, rrect(-RB, -RB, RB, RB, RB, 14), rrect(-RB + 1.6, -RB + 1.6, RB - 1.6, RB - 1.6, RB - 1.6, 14), 0, BASE));

  const jars = [];
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2 - Math.PI / 4;
    jars.push({ k, x: RJ * Math.cos(a), y: RJ * Math.sin(a), z: tween(REST[k]), last: NaN });
  }
  // paint order: far jars, then the post, then near jars
  const order = jars.slice().sort((p, q) => p.x + p.y - (q.x + q.y));
  let postDone = false;
  const post = () => {
    const s = solid(g);
    const [r, i] = rings(-2.4, -2.4, 2.4, 2.4, 2.4, 0.8);
    put(s, prism(P, front, r, i, BASE, POST));
    const knob = solid(g);
    const [r2, i2] = rings(-4.5, -4.5, 4.5, 4.5, 4.5, 1);
    put(knob, prism(P, front, r2, i2, POST, POST + 4));
  };
  order.forEach((j) => {
    if (!postDone && j.x + j.y > 0) { post(); postDone = true; }
    const grp = mk("g", {}, g);
    j.body = solid(grp); j.cap = solid(grp);
  });
  if (!postDone) post();

  function draw(j, lift) {
    if (lift === j.last) return;
    j.last = lift;
    const z0 = BASE + lift;
    const [r, i] = rings(j.x - JR, j.y - JR, j.x + JR, j.y + JR, JR, 1);
    put(j.body, prism(P, front, r, i, z0, z0 + JH));
    const c = JR + 0.6;
    const [rc, ic] = rings(j.x - c, j.y - c, j.x + c, j.y + c, c, 0.9);
    put(j.cap, prism(P, front, rc, ic, z0 + JH, z0 + JH + CH));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    jars.forEach((j) => { draw(j, tval(j.z, now)); if (!tdone(j.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: on a fixed plane through the resting jars, nearest jar centre
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BASE + JH / 2);
    let best = -1, bd = 11;
    jars.forEach((j) => { const d = Math.hypot(x - j.x, y - j.y); if (d < bd) { bd = d; best = j.k; } });
    return best;
  }
  const ring = (k, a) => { const d = Math.abs(k - a); return Math.min(d, N - d); };

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    jars.forEach((j) => {
      const z = a < 0 ? REST[j.k] : j.k === a ? LIFT : clamp(BUMP - 1.5 * ring(j.k, a), 0, BUMP);
      tset(j.z, z, now, from < 0 ? 0 : ring(j.k, from) * stag);
      const on = j.k === (a < 0 ? FAV : a);
      j.body.sil.classList.toggle("hi", on); j.cap.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "jar " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "spicecarousel",
  means: "A spice carousel: the jar under the pointer lifts off the turntable, its neighbours rise a little round the ring.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 134], [248, 191], [152, 191], null],
  mount,
});
