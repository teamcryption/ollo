/**
 * Welding bench: two steel plates butted on a bench, a gantry rail over the
 * seam, a carriage with its torch hanging from the rail. The pointer picks a
 * tack along the seam: the carriage slides there and the torch drops to it;
 * the tacks behind it read as laid. At rest the torch waits over tack 1.
 *
 * The pattern: one of many in a single row, a carriage that travels.
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween, clamp,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 5, X0 = 22, STEP = 24, SY = 30, PZ = 11, BZ = 60, FAV = 0;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const tackX = (k) => X0 + k * STEP;

function mount({ stage, svg, read }, value) {
  let drop = value;
  const tear = disposer();
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [150, 0, 0], [0, 60, 0], [150, 60, 0], [0, 26, BZ + 6], [150, 34, BZ + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 2, b = 1.2, parent = g) => {
    const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, o, i, z0, z1)); return s;
  };
  box(0, 0, 150, 60, 0, 8, 4, 2);
  box(10, 12, 140, 29.4, 8, PZ, 1.5, 1);
  box(10, 30.6, 140, 48, 8, PZ, 1.5, 1);
  const tacks = [];
  for (let k = 0; k < N; k++) { const d = flatDot(g, C, 1.6, "dot off"); place(d, P(tackX(k), SY, PZ)); tacks.push(d); }
  box(1, 25, 8, 35, 8, BZ, 1.5, 1);
  const mov = mk("g", {}, g);
  box(142, 25, 149, 35, 8, BZ, 1.5, 1);
  box(0, 25, 150, 35, BZ, BZ + 6, 2, 1.2);
  const nozzle = solid(mov), body = solid(mov);

  const cx = tween(tackX(FAV)), tip = tween(PZ + 14);
  let lx = NaN, lt = NaN;
  function draw(x, t) {
    if (x === lx && t === lt) return;
    lx = x; lt = t;
    put(nozzle, prism(P, front, disc(x, SY, 2.4), disc(x, SY, 1.4), t, BZ - 10));
    const [o, i] = rings(x - 10, SY - 7, x + 10, SY + 7, 3, 1.4);
    put(body, prism(P, front, o, i, BZ - 16, BZ));
  }
  nozzle.sil.classList.add("hi");

  const B = register(stage, (_dt, now) => {
    draw(tval(cx, now), tval(tip, now));
    return !tdone(cx, now) || !tdone(tip, now);
  });
  tear.add(B.unregister);

  const mids = tacks.map((_, k) => P(tackX(k), SY, PZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    const at = a < 0 ? FAV : a;
    tset(cx, tackX(at), now, 0);
    tset(tip, a < 0 ? PZ + 14 : PZ + 14 - clamp(drop, 0, 13), now, 0);
    tacks.forEach((d, k) => d.setAttribute("class", k === at && a >= 0 ? "dot" : k < at ? "dot m" : "dot off"));
    read.textContent = a < 0 ? "rest" : "tack " + (a + 1);
    B.wake();
  }
  setActive(-1);
  tear.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  tear.add(() => svg.replaceChildren());
  return { set: (v) => { drop = v; if (act >= 0) { const a = act; act = -2; setActive(a); } }, destroy: tear.dispose };
}

hairline({
  name: "weldingbench",
  means: "A welding bench with a torch on a gantry: the carriage slides to the tack under the pointer and drops the torch to the seam.",
  rules: [1, 4, 5, 8],
  range: [0, 12, 13],
  tour: [[150, 150], [230, 190], [290, 220], null],
  mount,
});
