/**
 * Difference engine: three columns of seven-sided figure wheels on a base,
 * capped by a frame plate on four posts, the long crank lying on top. The
 * pointer turns the crank toward itself; every figure wheel turns with it,
 * column by column, the odd columns the other way. At rest the crank lies
 * part-turned, bright. The slider is how far the crank follows.
 *
 * The pattern: one object, one part that turns to face the pointer.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 84, D = 30, CY = 15, COLS = [16, 42, 68], NW = 4, WR = 10, TZ = 58, ARM = 62, A0 = 2.2;
const at = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const turn = (ring, a) => ring.map((q) => ({ u: q.u * Math.cos(a) - q.v * Math.sin(a), v: q.u * Math.sin(a) + q.v * Math.cos(a), nu: q.nu * Math.cos(a) - q.nv * Math.sin(a), nv: q.nu * Math.sin(a) + q.nv * Math.cos(a) }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-ARM + 42, -ARM + CY, 0], [W, D, 0], [0, D, 0], [W, 0, 0], [42 + ARM, CY + ARM, TZ + 30], [42 - ARM, CY - ARM, TZ + 30], [42 + ARM, CY - ARM, TZ], [42 - ARM, CY + ARM, TZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 4, 2);
  put(solid(g), prism(P, front, br, bi, 0, 6));
  const parts = [];
  for (const [x, y] of [[4, 4], [W - 4, 4], [4, D - 4], [W - 4, D - 4]]) parts.push({ s: x + y, post: [x, y] });
  COLS.forEach((x, c) => parts.push({ s: x + CY, col: c, x }));
  parts.sort((a, b) => a.s - b.s);
  const wheels = [];
  for (const p of parts) {
    if (p.post) { put(solid(g), prism(P, front, at(circ(2.4, 16), p.post[0], p.post[1]), at(circ(1.4, 16), p.post[0], p.post[1]), 6, TZ)); continue; }
    put(solid(g), prism(P, front, at(circ(2, 12), p.x, CY), at(circ(1, 12), p.x, CY), 6, TZ));
    for (let i = 0; i < NW; i++) wheels.push({ c: p.col, x: p.x, z: 9 + i * 12, s: solid(g) });
  }
  const [tr, ti] = rings(0, 0, W, D, 4, 2);
  put(solid(g), prism(P, front, tr, ti, TZ, TZ + 4));
  const hub = solid(g), arm = mk("path", { class: "sil" }, g), handle = solid(g);
  put(hub, prism(P, front, at(circ(5, 20), 42, CY), at(circ(3.5, 20), 42, CY), TZ + 4, TZ + 9));
  const ang = spring(A0);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    for (const w of wheels) {
      const r = turn(circ(WR, 7), a * (w.c % 2 ? -1 : 1) * (1 + w.c * 0.4));
      put(w.s, prism(P, front, at(r, w.x, CY), at(turn(circ(WR - 2, 10), 0), w.x, CY), w.z, w.z + 7));
    }
    const ex = 42 + ARM * Math.cos(a), ey = CY + ARM * Math.sin(a);
    arm.setAttribute("d", poly(hull(ringAt(P, at(circ(5.5, 16), 42, CY), TZ + 9).concat(ringAt(P, at(circ(4.5, 16), ex, ey), TZ + 9), ringAt(P, at(circ(5.5, 16), 42, CY), TZ + 13), ringAt(P, at(circ(4.5, 16), ex, ey), TZ + 13)))));
    put(handle, prism(P, front, at(circ(3.6, 16), ex, ey), at(circ(2.2, 16), ex, ey), TZ + 13, TZ + 30));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let active = false;
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TZ + 10), d = Math.hypot(x - 42, y - CY);
    if (d > ARM + 30) return leave();
    let t = Math.atan2(y - CY, x - 42);
    while (t - A0 > Math.PI) t -= 2 * Math.PI;
    while (t - A0 < -Math.PI) t += 2 * Math.PI;
    ang.t = A0 + clamp(gain, 0, 1) * (t - A0);
    active = true;
    read.textContent = "turn " + Math.round(((t * 180) / Math.PI + 360) % 360);
    B.wake();
  }
  function leave() { ang.t = A0; active = false; read.textContent = "rest"; B.wake(); }
  arm.classList.add("hi");
  read.textContent = "rest";
  draw(A0);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "differenceengine",
  means: "A difference engine: the pointer turns the crank on top toward itself, and every column of figure wheels turns with it.",
  rules: [1, 3, 5, 6],
  range: [0.3, 0.8, 1],
  tour: [[308, 140], [124, 186], [94, 130], null],
  mount,
});
