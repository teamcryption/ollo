/**
 * Planimeter: a polar planimeter on the desk, its weighted pole holding one
 * end of the pole arm, the measuring carriage at the hinge, and the tracer
 * arm reaching out to a lens. The pointer leads the lens across the paper;
 * both arms fold at the hinge to follow. At rest the lens is the bright mark.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, ringAt, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L1 = 52, L2 = 52, RX = 72, RY = 44, ZA = 6;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-12, -16, 0], [100, 84, 0], [100, -16, 0], [-12, 84, 0], [0, 0, 14]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const sheet = [[8, 18, 0], [100, 18, 0], [100, 84, 0], [8, 84, 0]].map((p) => P(...p));
  mk("path", { class: "lo", d: poly(sheet) }, g);
  const blob = [[30, 50], [44, 34], [66, 38], [74, 58], [56, 72], [36, 68]].map(([x, y]) => P(x, y, 0));
  mk("path", { class: "nf dash", d: poly(blob) }, g);
  const pole = solid(g);
  put(pole, prism(P, front, disc(0, 0, 7), disc(0, 0, 5.5), 0, 9));
  const arm1 = mk("path", { class: "sil" }, g), cart = solid(g), arm2 = mk("path", { class: "sil" }, g);
  const wheel = mk("path", { class: "nf" }, g), lens = mk("path", { class: "sil hi" }, g);
  const tx = tween(RX), ty = tween(RY);
  let lx = NaN, ly = NaN;
  const bar = (a, b, r) => { const pts = []; for (const [x, y] of [a, b]) for (const z of [ZA - r, ZA + r]) pts.push(...ringAt(P, disc(x, y, r, 12), z)); return poly(hull(pts)); };
  function draw(x, y) {
    if (x === lx && y === ly) return;
    lx = x; ly = y;
    const d = Math.hypot(x, y), a = Math.atan2(y, x), c = clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1);
    const e = a - Math.acos(c), ex = L1 * Math.cos(e), ey = L1 * Math.sin(e);
    arm1.setAttribute("d", bar([0, 0], [ex, ey], 1.6));
    put(cart, prism(P, front, disc(ex, ey, 6), disc(ex, ey, 4.5), 0.5, 10));
    arm2.setAttribute("d", bar([ex, ey], [x, y], 1.6));
    wheel.setAttribute("d", poly(hull(ringAt(P, disc(ex, ey, 3, 16), 10).concat(ringAt(P, disc(ex, ey, 3, 16), 12)))));
    lens.setAttribute("d", poly(hull(ringAt(P, disc(x, y, 6, 28), 0).concat(ringAt(P, disc(x, y, 6, 28), ZA + 2)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tx, now), tval(ty, now)); return !(tdone(tx, now) && tdone(ty, now)); });
  bag.add(B.unregister);
  function aim(p) {
    let x = RX, y = RY;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      x = clamp(RX + (wx - RX) * amt, 24, 96); y = clamp(RY + (wy - RY) * amt, 22, 80);
      const d = Math.hypot(x, y), m = L1 + L2 - 4;
      if (d > m) { x *= m / d; y *= m / d; }
    }
    const now = performance.now();
    tset(tx, x, now, 0); tset(ty, y, now, 0);
    read.textContent = p ? Math.round(Math.hypot(x, y)) + "mm" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; }, destroy: bag.dispose };
}

hairline({
  name: "planimeter",
  means: "A polar planimeter: the pointer leads the tracer lens over the paper, and the two arms fold at the hinge to follow.",
  rules: [1, 2, 4, 5],
  range: [0.3, 1, 1],
  tour: [[119, 180], [298, 197], [208, 152], null],
  mount,
});
