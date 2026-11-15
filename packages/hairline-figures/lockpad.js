/**
 * Padlock hasp: a door edge with a hasp folded over its staple and a heavy
 * padlock hung through the staple. The pointer over the hasp swings the
 * padlock up on the staple, as a hand turns it to read the keyhole. At rest
 * the lock hangs with a slight tilt, bright. The slider is the swing.
 */
const { Cam, circ, clamp, fit, hull, poly, proj, seg, tdone, tset, tval, tween, disposer, mk, pointer, register, solid } = HL;

const W = 64, D = 6, H = 58, SX = 42, SZ = 38, LY0 = D + 1, LY1 = D + 9, REST = -9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D, 0], [W, D, H], [0, 0, H], [SX - 26, LY1, SZ - 18], [SX + 26, LY1, SZ - 14], [SX, LY1, SZ - 27]], 200, 160);
  const P = proj(C);

  const g = mk("g", {}, svg);
  const wall = solid(g);
  const wb = [[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0]];
  wall.sil.setAttribute("d", poly(hull(wb.map((q) => P(q[0], q[1], 0)).concat(wb.map((q) => P(q[0], q[1], H))))));
  wall.cr.setAttribute("d", poly(wb.map((q) => P(q[0], q[1], H))) + seg(P(W, D, 0), P(W, D, H)));
  const F = (x, z, y = D) => P(x, y, z);
  // the door's edge, the hinge leaf with its knuckle, and the hasp folded over the staple
  let fx = seg(F(30, 0), F(30, H)) + poly([F(8, SZ - 6), F(24, SZ - 6), F(24, SZ + 6), F(8, SZ + 6)]);
  for (const x of [12, 20]) fx += poly(circ(1, 8).map((q) => F(x + q.u, SZ + q.v)));
  mk("path", { d: fx, class: "nf lo" }, g);
  const hasp = solid(g);
  const hp = [[24, D], [SX + 6, D], [SX + 6, D + 1.4], [24, D + 1.4]];
  hasp.sil.setAttribute("d", poly(hull(hp.map((q) => P(q[0], q[1], SZ - 5)).concat(hp.map((q) => P(q[0], q[1], SZ + 5))))));
  hasp.cr.setAttribute("d", poly([F(SX - 2.5, SZ - 3, D + 1.4), F(SX + 2.5, SZ - 3, D + 1.4), F(SX + 2.5, SZ + 3, D + 1.4), F(SX - 2.5, SZ + 3, D + 1.4)]) + poly(circ(2.2, 12).map((q) => F(26.5 + q.u * 0.5, SZ + q.v * 2, D + 1.4))));
  // the staple: a loop standing out of the door through the hasp's slot
  mk("path", { d: poly([F(SX - 1.6, SZ - 2, D + 1.4), F(SX - 1.6, SZ - 2, D + 6), F(SX + 1.6, SZ - 2, D + 6), F(SX + 1.6, SZ - 2, D + 1.4)].concat([F(SX + 1.6, SZ + 2, D + 1.4), F(SX + 1.6, SZ + 2, D + 6), F(SX - 1.6, SZ + 2, D + 6)])), class: "nf" }, g);

  const lock = solid(g);
  const shackle = mk("path", { class: "nf" }, lock.g);
  const key = mk("path", { class: "nf lo" }, lock.g);
  const ang = tween(REST);
  let last = NaN;
  const PY = (LY0 + LY1) / 2;
  function draw(a) {
    const r = a * Math.PI / 180, ca = Math.cos(r), sa = Math.sin(r);
    const L = (u, v, y) => P(SX + u * ca - v * sa, y, SZ - 2 + u * sa + v * ca);
    const corners = [[-10, -27], [10, -27], [10, -11], [-10, -11]];
    const front = corners.map((q) => L(q[0], q[1], LY1)), back = corners.map((q) => L(q[0], q[1], LY0));
    lock.sil.setAttribute("d", poly(hull(front.concat(back))));
    lock.cr.setAttribute("d", poly(front));
    let sh = "";
    const arc = [];
    for (let k = 0; k <= 12; k++) { const t = Math.PI * k / 12; arc.push(L(-6 * Math.cos(t), -6 + 6 * Math.sin(t), PY)); }
    sh += "M" + [L(-6, -11, PY)].concat(arc, [L(6, -11, PY)]).map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L");
    shackle.setAttribute("d", sh);
    key.setAttribute("d", poly(circ(1.6, 12).map((q) => L(q.u, -17 + q.v, LY1))) + seg(L(0, -18.6, LY1), L(0, -22.5, LY1)));
  }
  const B = register(stage, (_dt, now) => {
    const a = tval(ang, now);
    if (a !== last) { draw(a); last = a; }
    return !tdone(ang, now);
  });
  bag.add(B.unregister);

  const restHull = hull([[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0], [0, 0, H], [W, 0, H], [W, D, H], [0, D, H], [SX, LY1, SZ - 29]].map((q) => P(q[0], q[1], q[2])));
  function inside([x, y]) {
    let o = false;
    for (let i = 0, j = restHull.length - 1; i < restHull.length; j = i++) {
      const [xi, yi] = restHull[i], [xj, yj] = restHull[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) o = !o;
    }
    return o;
  }
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? clamp(maxA, 20, 75) : REST, performance.now(), 0);
    lock.sil.classList.toggle("hi", true);
    read.textContent = on ? "turned" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act) { tset(ang, clamp(v, 20, 75), performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "lockpad",
  means: "A padlock hung through a hasp's staple on a door edge: the pointer swings the lock up on the staple to show its keyhole.",
  rules: [1, 3, 5, 6],
  range: [20, 50, 75],
  tour: [[196, 212], [136, 203], [264, 124], null],
  mount,
});
