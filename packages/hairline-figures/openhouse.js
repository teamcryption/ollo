/**
 * Open house: a yard sign on a lawn, a post with an arm and a panel hanging
 * from two hooks. The panel swings on its hooks toward the side the pointer
 * stands on, on a spring. At rest it hangs with a slight sway, bright.
 *
 * The pattern: one part swinging toward the pointer (swing).
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rings, seg, unproj, clamp, rad,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const AZ = 92, X0 = 14, X1 = 70, D0 = 6, D1 = 48, REST = 0.18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-24, -44, 0], [96, 44, 0], [96, -44, 0], [-24, 44, 0], [0, 0, AZ + 6], [X1, -40, AZ - 30], [X1, 40, AZ - 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [lr, li] = rings(-24, -44, 96, 44, 10, 2);
  put(solid(g), prism(P, front, lr, li, 0, 3));
  const [pr, pi] = rings(-3, -3, 3, 3, 1.5, 0.8);
  put(solid(g), prism(P, front, pr, pi, 3, AZ + 4));
  const panelG = mk("g", {}, g), arm = solid(g);
  const [ar, ai] = rings(-1, -2, X1 + 6, 2, 1, 0.6);
  put(arm, prism(P, front, ar, ai, AZ - 2, AZ + 2));
  const hooks = mk("path", { class: "nf lo" }, panelG), panel = mk("path", { class: "sil hi" }, panelG), face = mk("path", { class: "nf lo" }, panelG);

  function draw(a) {
    const c = Math.cos(a), s = Math.sin(a);
    const W = (x, d, t) => P(x, d * s + t * c, AZ - d * c + t * s);
    const pts = [];
    for (const x of [X0, X1]) for (const d of [D0, D1]) for (const t of [-1.2, 1.2]) pts.push(W(x, d, t));
    const h = hull(pts);
    panel.setAttribute("d", poly(fillet(h, h.map(() => 2.5), 3)));
    const n = s >= 0 ? 1.2 : -1.2;
    face.setAttribute("d", poly(fillet([W(X0 + 5, D0 + 5, n), W(X1 - 5, D0 + 5, n), W(X1 - 5, D1 - 5, n), W(X0 + 5, D1 - 5, n)], [2, 2, 2, 2], 3)));
    hooks.setAttribute("d", seg(W(X0 + 8, 0, 0), W(X0 + 8, D0, 0)) + seg(W(X1 - 8, 0, 0), W(X1 - 8, D0, 0)));
    if (s < -0.02) arm.g.after(panelG); else panelG.after(arm.g);
    if (s < -0.02) g.append(panelG);
  }

  const sw = spring(REST);
  let last = NaN;
  const B = register(stage, (dt) => {
    const m = stepS(sw, dt);
    if (sw.x !== last) { last = sw.x; draw(sw.x * rad(maxA)); }
    return m;
  });
  bag.add(B.unregister);

  function setSwing(t) {
    sw.t = t;
    read.textContent = t === REST ? "rest" : (t < 0 ? "back " : "front ") + Math.round(Math.abs(t) * maxA) + "°";
    B.wake();
  }
  setSwing(REST);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [, y] = unproj(C, sx, sy, 0); setSwing(clamp(y / 40, -1, 1)); },
    leave: () => setSwing(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "openhouse",
  means: "An open house sign on a lawn: its panel swings on two hooks toward whichever side of the post the pointer stands.",
  rules: [1, 3, 5, 8],
  range: [20, 45, 60],
  tour: [[267, 204], [194, 240], [151, 262], null],
  mount,
});
