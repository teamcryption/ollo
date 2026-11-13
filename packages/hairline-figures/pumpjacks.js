/**
 * Pumpjacks: three oil pumpjacks on a gravel pad, each a skid, a tapering
 * samson post, a walking beam with a curved horse head at the front, a
 * gearbox with a crank and counterweight at the back, a pitman arm between
 * crank and beam, and a polished rod down to the wellhead. The beams nod
 * slowly while the figure is in view; the pumps near the pointer speed up,
 * each on a spring on its rate, and the nearest is bright. At rest the
 * middle pump is bright. The slider is the reach.
 *
 * The pattern: a field put on a rate (slow); the hit is read against the
 * pivots, which never move.
 */
const {
  Cam, facing, fit, hull, open, poly, prism, proj, rad, reducedMotion, rings, ringAt, rrect, run, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, GAP = 32, PZ = 30, RH = 22, AMP = rad(15), CX = -18, CZ = 14, CR = 6, W0 = 0.9, WMAX = 4.2, FAV = 1;
const fall = (u) => (u <= 0.35 ? 1 : u <= 1 ? 1 - ((u - 0.35) / 0.65) * 0.9 : 0.1);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-32, -10, -3], [30, (N - 1) * GAP + 10, -3], [30, -10, -3], [-32, (N - 1) * GAP + 10, -3], [-20, 0, PZ + 8], [RH, 0, PZ + 12]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 1.2, b = 0.6) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  box(-32, -10, 30, (N - 1) * GAP + 10, -3, 0, 6, 2);

  /** Points of a shape drawn in the x–z plane, given a thickness across y. */
  const slab = (pts, y, t) => hull(pts.flatMap(([x, z]) => [P(x, y - t, z), P(x, y + t, z)]));
  const circle = (cx, cz, r, n = 18) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return [cx + r * Math.cos(a), cz + r * Math.sin(a)]; });

  const jacks = [];
  for (let k = 0; k < N; k++) {
    const y = k * GAP;
    box(-27, y - 5, 12, y + 5, 0, 3, 2, 0.8);
    box(RH - 3, y - 3, RH + 3, y + 3, 0, 6, 1.5, 0.6);
    const rod = mk("path", { class: "nf" }, g);
    // the samson post: a broad foot tapering to the bearing
    const foot = rrect(-6, y - 4.5, 6, y + 4.5, 2, 4), top = rrect(-1.6, y - 1.6, 1.6, y + 1.6, 0.8, 4), inner = rrect(-1, y - 1, 1, y + 1, 0.4, 4);
    put(solid(g), { sil: poly(hull(ringAt(P, foot, 3).concat(ringAt(P, top, PZ - 1.5)))), crease: open(ringAt(P, run(inner, front), PZ - 1.5)) });
    box(CX - 5, y - 3.5, CX + 5, y + 3.5, 3, CZ - 1, 1.5, 0.6);
    const grp = mk("g", {}, g);
    const beam = mk("path", { class: "sil" }, grp), head = mk("path", { class: "sil" }, grp);
    const crank = mk("path", { class: "sil" }, g), arm = mk("path", { class: "nf" }, g);
    jacks.push({ k, y, rod, beam, head, crank, arm, scr: P(0, y, PZ), ph: k * 2.1 + 0.6, w: spring(W0, { eps: 0.01 }), drawn: NaN });
  }

  function draw(j) {
    if (j.ph === j.drawn) return;
    j.drawn = j.ph;
    const th = -AMP * Math.sin(j.ph), c = Math.cos(th), s = Math.sin(th), y = j.y;
    const L = (x, z) => [x * c - z * s, PZ + x * s + z * c];
    j.beam.setAttribute("d", poly(slab([[-21, -1.6], [18, -1.6], [18, 1.6], [-21, 1.6]].map(([x, z]) => L(x, z)), y, 1.2)));
    const arc = [];
    for (let i = 0; i <= 8; i++) { const a = rad(-30 + i * 5.5); arc.push(L(RH * Math.cos(a), RH * Math.sin(a))); }
    for (let i = 8; i >= 0; i--) { const a = rad(-30 + i * 5.5); arc.push(L(16 * Math.cos(a), 16 * Math.sin(a) + 1)); }
    j.head.setAttribute("d", poly(slab(arc, y, 2)));
    // the crank turns once per nod; the weight sits opposite the pin
    const pa = j.ph, pin = [CX + CR * Math.cos(pa), CZ + CR * Math.sin(pa)], wc = [CX - 4 * Math.cos(pa), CZ - 4 * Math.sin(pa)];
    j.crank.setAttribute("d", poly(slab(circle(CX, CZ, 2.6).concat(circle(wc[0], wc[1], 5.5), circle(pin[0], pin[1], 1.6)), y + 5, 1)));
    const rear = L(-20, 0), bridle = PZ - 11 + RH * th;
    j.arm.setAttribute("d", seg(P(pin[0], y + 6.5, pin[1]), P(rear[0], y + 1.5, rear[1])) + seg(P(pin[0], y + 3.5, pin[1]), P(rear[0], y - 1.5, rear[1])));
    j.rod.setAttribute("d", seg(P(RH, y, 6), P(RH, y, bridle)) + seg(P(RH, y - 2, bridle), P(RH, y + 2, bridle)));
  }

  const still = reducedMotion();
  const B = register(stage, (dt) => {
    let m = false;
    for (const j of jacks) {
      if (stepS(j.w, dt)) m = true;
      if (!still) { j.ph = (j.ph + j.w.x * dt) % (Math.PI * 2); m = true; }
      draw(j);
    }
    return m;
  });
  bag.add(B.unregister);

  const dist = (j) => Math.hypot(j.scr[0] - over[0], (j.scr[1] - over[1]) * 0.8);
  function retarget() {
    let mark = jacks[FAV];
    for (const j of jacks) j.w.t = over ? W0 + (WMAX - W0) * fall(dist(j) / reach) : W0;
    if (over) { mark = jacks.reduce((a, b) => (dist(b) < dist(a) ? b : a)); read.textContent = "pump " + (mark.k + 1); } else read.textContent = "rest";
    for (const j of jacks) { const on = j === mark; j.beam.classList.toggle("hi", on); j.head.classList.toggle("hi", on); }
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "pumpjacks",
  means: "Three oil pumpjacks on a pad: the beams nod all the time, and the pumps near the pointer speed up, the nearest fastest.",
  rules: [1, 3, 5, 8],
  range: [45, 75, 115],
  tour: [[261, 104], [202, 133], [143, 162], null],
  mount,
});
