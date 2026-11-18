/**
 * Wood stove: a cast-iron firebox on four short legs, a top plate and a
 * flue pipe rising from it, a glass-fronted door on its front face. The
 * pointer over the stove swings the door open on its hinge, wider the
 * nearer it comes to the handle, and the fire inside flares in the draft.
 * At rest the door stands ajar, bright. The slider is how far it opens.
 *
 * The pattern: one part swinging on a hinge (single object).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 40, BY = 50, Z0 = 8, Z1 = 44, HY = 6, W = 38, DZ0 = 11, DZ1 = 40, REST = 16, T = 2.2;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.6);
  const ex = BX + W * Math.sin(rad(130)), ey = HY + W * Math.cos(rad(130));
  fit(C, [[-2, -2, 0], [BX + 2, BY + 2, 0], [-2, BY + 2, 0], [BX + 2, -2, 0], [18, 22, 74], [ex, ey, DZ1], [ex, ey, DZ0], [BX + 2, BY + 2, 47]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // legs, far to near
  for (const [x, y] of [[4, 4], [4, BY - 4], [BX - 4, 4], [BX - 4, BY - 4]]) put(solid(g), prism(P, front, disc(x, y, 2.6), disc(x, y, 1.6), 0, Z0 + 1));
  // firebox and top plate
  const [br, bi] = rings(0, 0, BX, BY, 4, 1.5);
  put(solid(g), prism(P, front, br, bi, Z0, Z1));
  const [tr, ti] = rings(-2, -2, BX + 2, BY + 2, 4, 1.5);
  put(solid(g), prism(P, front, tr, ti, Z1, Z1 + 3));
  // flue pipe with a collar
  put(solid(g), prism(P, front, disc(18, 22, 7.5, 28), disc(18, 22, 6, 28), Z1 + 3, Z1 + 6));
  put(solid(g), prism(P, front, disc(18, 22, 5.5, 28), disc(18, 22, 4.2, 28), Z1 + 6, 74));
  // the opening on the front face, logs and fire inside it
  const F = (y, z) => P(BX, y, z);
  mk("path", { d: poly([F(HY + 2, DZ0 + 2), F(HY + 2, DZ1 - 2), F(HY + W - 2, DZ1 - 2), F(HY + W - 2, DZ0 + 2)]), class: "lo" }, g);
  mk("path", { d: open([F(HY + 6, DZ0 + 5), F(HY + W - 8, DZ0 + 8)]) + open([F(HY + 9, DZ0 + 8), F(HY + W - 5, DZ0 + 5)]), class: "nf lo" }, g);
  const flame = mk("path", { class: "nf" }, g);
  const door = mk("path", { class: "sil" }, g), glass = mk("path", { class: "nf lo" }, g), handle = mk("path", { class: "nf" }, g);
  mk("path", { d: open([F(HY, DZ0 + 4), F(HY, DZ0 + 7)]) + open([F(HY, DZ1 - 7), F(HY, DZ1 - 4)]), class: "nf" }, g);

  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 0.05) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const at = (u, z, o) => P(BX + u * s + o * c, HY + u * c - o * s, z);
    door.setAttribute("d", poly(hull([at(0, DZ0, 0), at(W, DZ0, 0), at(W, DZ1, 0), at(0, DZ1, 0), at(0, DZ0, T), at(W, DZ0, T), at(W, DZ1, T), at(0, DZ1, T)])));
    glass.setAttribute("d", poly([at(6, DZ0 + 6, T), at(W - 8, DZ0 + 6, T), at(W - 8, DZ1 - 6, T), at(6, DZ1 - 6, T)]) + open([at(10, DZ0 + 10, T), at(18, DZ1 - 10, T)]));
    handle.setAttribute("d", open([at(W - 3.5, DZ0 + 11, T), at(W - 3.5, DZ0 + 11, T + 3.5), at(W - 3.5, DZ1 - 11, T + 3.5), at(W - 3.5, DZ1 - 11, T)]));
    const k = clamp((a - REST) / 100, 0, 1), top = DZ0 + 14 + 13 * k, m = HY + W / 2;
    flame.setAttribute("d", poly([F(m - 9, DZ0 + 7), F(m - 6, DZ0 + 13 + 5 * k), F(m - 3, DZ0 + 11), F(m + 1, top), F(m + 4, DZ0 + 12), F(m + 7, DZ0 + 15 + 6 * k), F(m + 10, DZ0 + 7)]));
  }
  draw(REST);

  const B = register(stage, (dt) => {
    const moving = stepS(ang, dt);
    draw(ang.x);
    return moving;
  });
  bag.add(B.unregister);

  // hit area: the stove's rest outline on screen; reach falls off from the closed door's handle
  const box = hull([...[[0, 0], [BX, 0], [BX, BY], [0, BY]].flatMap(([x, y]) => [P(x, y, 0), P(x, y, Z1 + 3)]), P(18, 22, 74)]);
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const bx0 = Math.min(...xs) - 4, bx1 = Math.max(...xs) + 4, by0 = Math.min(...ys) - 4, by1 = Math.max(...ys) + 4;
  const hp = P(BX, HY + W - 3.5, (DZ0 + DZ1) / 2);
  let on = null;
  function move([sx, sy]) {
    const inside = sx > bx0 && sx < bx1 && sy > by0 && sy < by1;
    if (inside) {
      const f = clamp(1 - Math.hypot(sx - hp[0], sy - hp[1]) / 260, 0.45, 1);
      ang.t = REST + (max - REST) * f;
    } else ang.t = REST;
    if (inside !== on) { on = inside; door.classList.add("hi"); }
    read.textContent = inside ? "door " + Math.round(ang.t) + "°" : "rest";
    B.wake();
  }
  door.classList.add("hi");
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => move([-999, -999]) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { ang.t = REST + (max - REST) * 0.9; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "woodstove",
  means: "A wood stove on short legs with a flue: the pointer swings its glass door open, wider near the handle, and the fire flares.",
  rules: [1, 3, 5, 8],
  range: [50, 105, 125],
  tour: [[188, 185], [162, 58], [151, 270], null],
  mount,
});
