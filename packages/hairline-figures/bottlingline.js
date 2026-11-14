/**
 * Bottling line: a short conveyor belt carrying five bottles, each with its
 * cap set on its neck. The pointer picks a bottle by where it is along the
 * belt: that cap lifts clear off its neck as if the capper had raised it, and
 * the neighbours' caps rise a little, staggered from it. At rest one cap sits
 * half seated, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is on a fixed plane
 * through the bottles' shoulders, nearest bottle along x.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, run, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 12, X0 = 8, BELT = 0, R = 4.2, SH = 13, NK = 18, NT = 23, CAP = 3.4, LIFT = 17;
const L = X0 + (N - 1) * STEP + 8;
const REST = [0.3, 0.8, 4, 0.6, 0.2], FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.8);
  fit(C, [[-8, -7, -5], [L, 7, -5], [L, -7, -5], [-8, 7, -5], [X0, 0, NT + CAP + LIFT], [L, 0, NT + CAP + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the belt: a long rounded slab, rollers marked on its near side, a lane line on top
  const [br, bi] = rings(-8, -7, L, 7, 6, 1.2);
  const belt = solid(g);
  put(belt, prism(P, front, br, bi, -5, BELT));
  let marks = seg(P(-2, -3.5, BELT), P(L - 4, -3.5, BELT)) + seg(P(-2, 3.5, BELT), P(L - 4, 3.5, BELT));
  for (let k = 0; k <= N; k++) marks += seg(P(X0 - 6 + k * STEP, 7, -1.5), P(X0 - 6 + k * STEP, 7, -3.5));
  mk("path", { class: "nf lo", d: marks }, belt.g);

  const body = circ(R, 16), bodyIn = circ(R - 1, 16), neck = circ(1.9, 12), capR = circ(2.4, 12), capIn = circ(1.7, 12);
  const at = (ring, x) => ring.map((s) => ({ ...s, u: s.u + x }));
  const bottles = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP;
    const b = solid(g);
    b.sil.setAttribute("d", poly(hull(ringAt(P, at(body, x), BELT).concat(ringAt(P, at(body, x), SH), ringAt(P, at(neck, x), NK), ringAt(P, at(neck, x), NT)))));
    b.cr.setAttribute("d", open(ringAt(P, run(at(bodyIn, x), front), SH)) + open(ringAt(P, run(at(body, x), front), 4)));
    const cap = solid(g);
    bottles.push({ x, cap, z: tween(REST[k]), last: NaN });
  }

  function draw(b, lift) {
    if (lift === b.last) return;
    b.last = lift;
    put(b.cap, prism(P, front, at(capR, b.x), at(capIn, b.x), NT - 2.5 + lift, NT - 2.5 + lift + CAP));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    bottles.forEach((b) => { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, SH);
    if (x < -8 || x > L || y < -12 || y > 12) return -1;
    return clamp(Math.round((x - X0) / STEP), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bottles.forEach((b, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : Math.max(0, 3 - 1.2 * Math.abs(k - a));
      tset(b.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.cap.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cap " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bottlingline",
  means: "Five bottles on a conveyor: the cap of the bottle under the pointer lifts off its neck, the neighbours' caps rise a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[146, 138], [232, 180], [275, 202], null],
  mount,
});
