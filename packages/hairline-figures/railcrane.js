/**
 * Railway crane: a breakdown crane on its flat wagon, standing on a short
 * length of track. The cab and its long luffed jib sit on a turntable; the
 * pointer on the ground swings them round to face it, hook hanging from the
 * jib's head. At rest the jib points along the wagon, bright. The slider is
 * how far the crane may slew either side.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CX = 50, CY = 18, REST = 22, H = 18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-10, -40, 0], [110, 76, 0], [CX - 70, CY, 74], [CX + 70, CY, 74], [CX, CY - 70, 74], [CX, CY + 70, 74]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (parent, x0, y0, x1, y1, z0, z1) => {
    const [r, i] = rings(x0, y0, x1, y1, 1.5, 0.8), s = solid(parent);
    put(s, prism(P, front, r, i, z0, z1));
    return s;
  };
  for (let x = -6; x <= 104; x += 12) box(g, x, 2, x + 5, 34, 0, 2);
  box(g, -10, 9, 110, 11, 2, 5);
  box(g, -10, 25, 110, 27, 2, 5);
  for (const x of [14, 30, 70, 86]) box(g, x - 6, 6, x + 6, 30, 5, 11);
  box(g, 0, 4, 100, 32, 11, 16);
  const top = mk("g", {}, g);

  const a = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    top.replaceChildren();
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
    const W = (u, v, z) => P(CX + u * c - v * s, CY + u * s + v * c, z);
    const blk = (u0, u1, v0, v1, z0, z1, zr = 0) => {
      const pts = [];
      for (const u of [u0, u1]) for (const v of [v0, v1]) for (const z of [z0, z1]) pts.push(W(u, v, z + (u - u0) * zr));
      return poly(hull(pts));
    };
    mk("path", { d: poly(hull([...Array(24)].map((_, k) => W(13 * Math.cos(k / 3.82), 13 * Math.sin(k / 3.82), H)).concat([...Array(24)].map((_, k) => W(13 * Math.cos(k / 3.82), 13 * Math.sin(k / 3.82), H - 2))))) }, top);
    mk("path", { d: blk(-20, -8, -11, 11, H, H + 14), class: "sil" }, top);
    mk("path", { d: blk(-10, 12, -11, 11, H, H + 22), class: "sil" }, top);
    mk("path", { d: blk(0, 12, -11, 11, H + 10, H + 22), class: "nf lo" }, top);
    const jib = mk("path", { d: blk(6, 74, -4, 4, H + 14, H + 20, 0.42), class: "sil hi" }, top);
    const tip = W(72, 0, H + 14 + 66 * 0.42), hook = W(72, 0, H + 6);
    mk("path", { d: seg(tip, hook), class: "nf" }, top);
    mk("path", { d: blk(70, 74, -2, 2, H + 1, H + 6), class: "sil" }, top);
    return jib;
  }
  draw(REST);

  const B = register(stage, (dt) => {
    const m = stepS(a, dt);
    draw(a.x);
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    let t = REST;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0), d = Math.hypot(x - CX, y - CY);
      if (d > 14 && d < 130) {
        let deg = (Math.atan2(y - CY, x - CX) * 180) / Math.PI - REST;
        deg = ((deg + 540) % 360) - 180;
        t = REST + clamp(deg, -reach, reach);
      }
    }
    a.t = t;
    read.textContent = t === REST ? "rest" : "slew " + Math.round(t - REST) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "railcrane",
  means: "A breakdown crane on its rail wagon: the cab and long jib slew round on the turntable to face the pointer.",
  rules: [1, 3, 5, 6],
  range: [40, 120, 160],
  tour: [[37, 236], [76, 184], [320, 226], null],
  mount,
});
