/**
 * Dart cabinet: a wall cabinet holding a dartboard, its two doors on hinges
 * at the sides. The pointer swings the doors: the door nearer it opens wide,
 * the other follows less, each on its own spring. At rest both stand ajar
 * and the board's rim is bright. The slider is the spring's stiffness.
 *
 * The pattern: a continuous aim per door (terrain's spring on an angle); the
 * hit is on a fixed plane through the cabinet's middle, which never moves.
 */
const {
  Cam, circ, fit, facing, open, poly, prism, proj, rings, unproj, spring, stepS, clamp, lerp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const WD = 64, DP = 10, HT = 72, DW = WD / 2, REST = [0.55, 0.85], WIDE = 1.65;
const turn = (ring, a, hx, hy, s) => {
  const c = Math.cos(a), n = Math.sin(a);
  return ring.map((q) => ({ u: hx + s * (q.u * c - q.v * n), v: hy + q.u * n + q.v * c, nu: s * (q.nu * c - q.nv * n), nv: q.nu * n + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-DW, 0, 0], [WD + DW, DP + DW, HT], [0, DP + DW, 0], [WD, 0, HT], [WD, DP + DW, 0], [0, 0, HT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ba, bb] = rings(0, 0, WD, DP, 3, 1.4);
  put(solid(g), prism(P, front, ba, bb, 0, HT));
  // the board, on the cabinet's front face
  const ring = (r) => circ(r, 40).map((q) => P(WD / 2 + q.u, DP + 0.2, HT / 2 + q.v));
  const rim = mk("path", { d: poly(ring(24)) }, g);
  mk("path", { class: "nf lo", d: poly(ring(17)) + poly(ring(10)) + poly(ring(2.5)) }, g);
  const wires = [];
  for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; wires.push(open([P(WD / 2 + 2.5 * Math.cos(a), DP + 0.2, HT / 2 + 2.5 * Math.sin(a)), P(WD / 2 + 17 * Math.cos(a), DP + 0.2, HT / 2 + 17 * Math.sin(a))])); }
  mk("path", { class: "nf lo", d: wires.join("") }, g);
  const [da, db] = rings(0, -2, DW, 0, 0.9, 0.4);
  const doors = [[0, 1], [WD, -1]].map(([hx, s], i) => ({ i, hx, s, sol: solid(g), sp: spring(REST[i], { k: 100 * value, c: 18 * Math.sqrt(value) }), drawn: NaN }));
  function draw(d) {
    const a = d.sp.x;
    if (Math.abs(a - d.drawn) < 1e-4) return;
    d.drawn = a;
    put(d.sol, prism(P, front, turn(da, d.s * a, d.hx, DP + 2, d.s), turn(db, d.s * a, d.hx, DP + 2, d.s), 0, HT));
  }
  const B = register(stage, (dt) => { let m = false; for (const d of doors) { if (stepS(d.sp, dt)) m = true; draw(d); } return m; });
  bag.add(B.unregister);
  function set(x) {
    let near = null;
    if (x == null) doors.forEach((d) => { d.sp.t = REST[d.i]; });
    else {
      const f = clamp(x / WD, 0, 1);
      doors[0].sp.t = lerp(WIDE, 0.5, f); doors[1].sp.t = lerp(0.5, WIDE, f);
      near = f < 0.5 ? doors[0] : doors[1];
    }
    rim.classList.toggle("hi", !near);
    doors.forEach((d) => d.sol.sil.classList.toggle("hi", d === near));
    read.textContent = near ? (near.i ? "right" : "left") : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], HT / 2); set(Math.abs(y - DP) > 70 || x < -50 || x > WD + 50 ? null : x); },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => doors.forEach((d) => { d.sp.k = 100 * v; d.sp.c = 18 * Math.sqrt(v); }), destroy: bag.dispose };
}

hairline({
  name: "darts2",
  means: "A dart cabinet on the wall: its two doors swing open toward the pointer, the nearer one wide, to show the board.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[154, 141], [249, 188], [202, 165], null],
  mount,
});
