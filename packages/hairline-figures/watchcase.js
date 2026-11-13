/**
 * Watch case: an open case, its lid standing behind, holding six wristwatches
 * on pillows, each a round case with a crystal and two hands, its strap looped
 * round the pillow. The pointer picks a watch by where it stands: it lifts off
 * its pillow and tilts toward the reader, its hands turn to the pointer, and
 * the watches beside it lift a little, staggered from it. At rest one watch
 * is raised, bright, and every watch shows its own time. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle), plus a spring per watch
 * for the hands, which follow the pointer's place on the case floor.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, rrect, seg, unproj,
  spring, stepS, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, STEP = 24, YC = 22, CZ = 8, PH = 8, ZT = CZ + PH, FR = 6.5, LIFT = 12, TILT = 0.5, FAV = 2;
const X1 = N * STEP, REST = [0.6, 2.2, -1.0, 1.4, -2.4, 0.2];
const LOOP = rrect(-16.6, -PH, 16.6, 0.8, 4, 4), FACE = circ(FR, 32), GLASS = circ(FR - 1.4, 28);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, -5, 0], [X1, 44, 0], [X1, -5, 0], [0, 44, 0], [0, -5, 56], [X1, -5, 56], [STEP / 2, YC + 6, ZT + LIFT + 12]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the lid, open and standing behind, with its lining; then the case
  const [lr, li] = rings(0, -5, X1, 0, 2, 0.8);
  put(solid(g), prism(P, front, lr, li, 0, 56));
  mk("path", { class: "nf lo", d: poly([[5, 0, 6], [X1 - 5, 0, 6], [X1 - 5, 0, 50], [5, 0, 50]].map((p) => P(...p))) }, g);
  const [cr, ci] = rings(0, 0, X1, 44, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = STEP / 2 + k * STEP;
    const [pr, pi] = rings(x - 9, YC - 16, x + 9, YC + 16, 5, 1.5);
    put(solid(g), prism(P, front, pr, pi, CZ, ZT));
    items.push({ k, x, z: tween(k === FAV ? LIFT * 0.6 : 0), ha: spring(REST[k]), last: "" });
  }
  for (const it of items) {
    it.grp = mk("g", {}, g);
    it.strap = mk("path", { class: "sil" }, it.grp);
    it.cas = mk("path", { class: "sil" }, it.grp);
    it.glass = mk("path", { class: "nf lo" }, it.grp);
    it.hands = mk("path", { class: "nf" }, it.grp);
  }

  function draw(it, lift) {
    const a = it.ha.x, key = lift.toFixed(2) + "," + a.toFixed(3);
    if (key === it.last) return;
    it.last = key;
    const th = TILT * lift / LIFT, c = Math.cos(th), s = Math.sin(th);
    const W = (x, y, z) => P(it.x + x, YC + y * c + z * s, ZT + lift - y * s + z * c);
    const loop = [];
    for (const q of LOOP) loop.push(W(-4, q.u, q.v), W(4, q.u, q.v));
    it.strap.setAttribute("d", poly(hull(loop)));
    const cas = [];
    for (const q of FACE) cas.push(W(q.u, q.v, 0.8), W(q.u, q.v, 3.6));
    it.cas.setAttribute("d", poly(hull(cas)));
    it.glass.setAttribute("d", poly(GLASS.map((q) => W(q.u, q.v, 3.6))));
    const o = W(0, 0, 3.7);
    it.hands.setAttribute("d", seg(o, W((FR - 2) * Math.cos(a), (FR - 2) * Math.sin(a), 3.7)) +
      seg(o, W((FR - 3.6) * Math.cos(a + 2.1), (FR - 3.6) * Math.sin(a + 2.1), 3.7)));
  }

  const B = register(stage, (dt, now) => {
    let moving = false;
    for (const it of items) {
      if (stepS(it.ha, dt)) moving = true;
      draw(it, tval(it.z, now));
      if (!tdone(it.z, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, YC, ZT));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 55 ? best : -1;
  }

  let act = -2, over = null;
  function setActive(a) {
    const now = performance.now();
    if (a !== act) {
      const from = a >= 0 ? a : act;
      act = a;
      items.forEach((it, k) => {
        const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 3.5 : 0;
        tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
        it.cas.classList.toggle("hi", k === (a < 0 ? FAV : a));
      });
      read.textContent = a < 0 ? "rest" : "watch " + (a + 1);
    }
    items.forEach((it, k) => {
      let t = REST[k];
      if (k === a && over) {
        const dx = over[0] - it.x, dy = over[1] - YC;
        t = Math.hypot(dx, dy) < 3 ? it.ha.t : Math.atan2(dy, dx);
      }
      it.ha.t = it.ha.t + clamp(t - it.ha.t - Math.PI * 2 * Math.round((t - it.ha.t) / (Math.PI * 2)), -Math.PI, Math.PI);
    });
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], ZT); setActive(hit(p)); },
    leave: () => { over = null; setActive(-1); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "watchcase",
  means: "Six watches on pillows in an open case: the watch under the pointer lifts, tilts and turns its hands to it.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[114, 149], [180, 182], [279, 231], null],
  mount,
});
