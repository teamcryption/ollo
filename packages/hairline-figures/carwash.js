/**
 * Car wash: a wash bay with a car body parked in the middle and two tall
 * rotating brushes, each hanging from a carriage on its own overhead gantry
 * rail, one on either side of the car. The pointer sets where along the car
 * the wash is: both brushes travel toward its x on springs, the brush on the
 * pointer's side further, and they spin only while they travel, the near one
 * faster. At rest the brushes stand apart, the far one bright. The slider is
 * the spring's stiffness.
 *
 * The pattern: a continuous aim (one spring per brush); the side is picked on
 * the bay floor's plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const LX = 44, SIDE = 21, BR = 5, TOP = 40, REST = [-24, 18], FAV = 0;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-LX - 4, -SIDE - 8, 0], [LX + 4, SIDE + 8, 0], [-LX - 4, SIDE + 8, 0], [LX + 4, -SIDE - 8, 0], [-LX, -SIDE, TOP + 4], [LX, SIDE, TOP + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-LX - 4, -SIDE - 8, LX + 4, SIDE + 8, 4, 1.4);
  put(solid(g), prism(P, front, fr, fi, -2, 0));

  const rail = (y, parent) => {
    for (const x of [-LX, LX]) put(solid(parent), prism(P, front, disc(x, y, 1.4, 16), null, 0, TOP));
    const [r, i] = rings(-LX - 2, y - 2, LX + 2, y + 2, 1.2, 0.6);
    put(solid(parent), prism(P, front, r, i, TOP, TOP + 3));
  };
  const brushes = [-SIDE + 2, SIDE - 2].map((y, k) => ({ k, y, sp: spring(REST[k], { k: 100 * value, c: 18 * Math.sqrt(value) }), phase: k * 0.7, drawn: "" }));
  const mkBrush = (b) => {
    b.grp = mk("g", {}, g);
    b.car = solid(b.grp); b.body = solid(b.grp);
    b.bristles = mk("path", { class: "nf lo" }, b.grp);
  };
  // far rail and brush, the car, then the near brush and rail
  rail(-SIDE - 2, g);
  mkBrush(brushes[0]);
  const [lr, li] = rings(-26, -11, 26, 11, 6, 1.6);
  put(solid(g), prism(P, front, lr, li, 2.5, 13));
  const [cr, ci] = rings(-12, -9, 12, 9, 5, 1.4);
  put(solid(g), prism(P, front, cr, ci, 13, 21));
  for (const x of [-16, 16]) for (const y of [-11.2, 11.2]) put(solid(g), prism(P, front, disc(x, y, 0.9, 12).map((q) => q), null, 0, 2.5));
  mkBrush(brushes[1]);
  rail(SIDE + 2, g);

  function draw(b) {
    const x = b.sp.x, key = x.toFixed(2) + "," + b.phase.toFixed(3);
    if (key === b.drawn) return;
    b.drawn = key;
    const sy = b.k === 0 ? -SIDE - 2 : SIDE + 2;
    const [r, i] = rings(x - 3, sy - 3, x + 3, sy + 3, 1.2, 0.6);
    put(b.car, prism(P, front, r, i, TOP - 4, TOP));
    put(b.body, prism(P, front, disc(x, b.y, BR), disc(x, b.y, BR - 1.2), 3, TOP - 5));
    let d = "";
    for (let j = 0; j < 8; j++) {
      const a = b.phase + (j / 8) * Math.PI * 2, nx = Math.cos(a), ny = Math.sin(a);
      if (nx + ny < 0.3) continue;
      d += seg(P(x + BR * nx, b.y + BR * ny, 5), P(x + BR * nx, b.y + BR * ny, TOP - 7));
    }
    b.bristles.setAttribute("d", d);
  }
  let side = -1;
  const B = register(stage, (dt) => {
    let m = false;
    for (const b of brushes) {
      if (stepS(b.sp, dt)) { m = true; b.phase += dt * Math.abs(b.sp.v) * (b.k === side ? 0.5 : 0.25); }
      draw(b);
    }
    return m;
  });
  bag.add(B.unregister);

  function setPointer(w) {
    side = w ? (w[1] < 0 ? 0 : 1) : -1;
    for (const b of brushes) {
      const lo = b.k === 0 ? -LX + 6 : -LX + 14, hi = b.k === 0 ? LX - 14 : LX - 6;
      b.sp.t = w ? clamp(w[0] + (b.k === side ? 0 : (b.k === 0 ? -8 : 8)), lo, hi) : REST[b.k];
      b.body.sil.classList.toggle("hi", b.k === (w ? side : FAV));
    }
    read.textContent = w ? "brush " + (side + 1) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const w = unproj(C, p[0], p[1], 0);
      setPointer(Math.abs(w[0]) > LX + 10 || Math.abs(w[1]) > SIDE + 14 ? null : w);
    },
    leave: () => setPointer(null),
  }));
  bag.add(() => svg.replaceChildren());
  setPointer(null);
  for (const b of brushes) draw(b);
  return {
    set: (v) => { for (const b of brushes) { b.sp.k = 100 * v; b.sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "carwash",
  means: "A car wash bay: two tall brushes travel along the car toward the pointer and spin while they move, the near one faster.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[150, 150], [240, 190], [200, 230], null],
  mount,
});
