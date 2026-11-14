/**
 * Blender: a squat motor base with a row of four speed buttons on its front
 * ledge, a jug that widens to its rim, and a lid. The pointer picks a speed
 * by where it is along the buttons: that button sinks, the others spring up
 * staggered from it, and the lid rides up the faster the speed. At rest the
 * lowest speed is held in, bright.
 *
 * The pattern: one of many in a single row; the hit is the nearest button's
 * rest centre by screen x. The jug is a solid whose top is larger than its foot.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, rrect, run, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, BH = 12, BTN = 2.6, J0 = BH + 1, J1 = 46, LH = 3.5, LIFT = 2.2, FAV = 0;
const BX = [-10.5, -4, 2.5, 9];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.8);
  fit(C, [[-15, -15, 0], [15, 21, 0], [15, -15, 0], [-15, 21, 0], [-12, -14, J1 + LH + LIFT * 3], [12, 10, J1 + LH + LIFT * 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the motor base, with a front ledge for the buttons
  const base = solid(g);
  const [br, bi] = rings(-15, -15, 15, 21, 6, 1.6);
  put(base, prism(P, front, br, bi, 0, BH));

  // the jug: foot smaller than rim, hull of two rings
  const foot = rrect(-9, -11, 9, 7, 6, 6), top = rrect(-12, -14, 12, 10, 8, 6), inner = rrect(-10.6, -12.6, 10.6, 8.6, 6.6, 6);
  const jug = solid(g);
  jug.sil.setAttribute("d", poly(hull(ringAt(P, foot, J0).concat(ringAt(P, top, J1)))));
  jug.cr.setAttribute("d", open(ringAt(P, run(inner, front), J1)));
  const lid = solid(g), lz = tween(0);
  let lidLast = NaN;

  const btns = BX.map((x, k) => ({ k, x, s: solid(g), z: tween(k === FAV ? 0 : BTN), last: NaN }));

  function drawBtn(b, h) {
    if (h === b.last) return;
    b.last = h;
    const [r, i] = rings(b.x, 13, b.x + 4.6, 18.5, 1.6, 0.6);
    put(b.s, prism(P, front, r, i, BH, BH + 0.6 + h));
  }
  function drawLid(z) {
    if (z === lidLast) return;
    lidLast = z;
    const [r, i] = rings(-12.6, -14.6, 12.6, 10.6, 8.4, 1.4);
    put(lid, prism(P, front, r, i, J1 + z, J1 + z + LH));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    btns.forEach((b) => { drawBtn(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; });
    drawLid(tval(lz, now));
    return moving || !tdone(lz, now);
  });
  bag.add(B.unregister);

  // the hit: inside the figure's span on the ledge plane, nearest button by screen x
  const cx = btns.map((b) => P(b.x + 2.3, 15.7, BH)[0]);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BH);
    if (x < -40 || x > 24 || y < -40 || y > 26 || x + y < -50) return -1;
    let best = 0;
    cx.forEach((c, k) => { if (Math.abs(c - sx) < Math.abs(cx[best] - sx)) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const sel = a < 0 ? FAV : a;
    btns.forEach((b) => {
      tset(b.z, b.k === sel ? 0 : BTN, now, from < 0 ? 0 : Math.abs(b.k - from) * stag);
      b.s.sil.classList.toggle("hi", b.k === sel);
    });
    tset(lz, a < 0 ? 0 : clamp(a + 1, 0, N) * LIFT * 0.75, now, 0);
    read.textContent = a < 0 ? "rest" : "speed " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "blenderjug",
  means: "A blender: the speed button under the pointer sinks in, the others pop up, and the lid rides up as the speed climbs.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[144, 222], [179, 240], [196, 248], null],
  mount,
});
