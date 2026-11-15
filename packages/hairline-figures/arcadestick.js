/**
 * Arcade cabinet: a bartop cabinet, its screen standing behind a control
 * panel with a ball-top stick and two buttons. The stick leans toward the
 * pointer on its own spring and the sprite on the screen slides the same way.
 * At rest the stick leans to the left, its ball bright.
 *
 * The pattern: a continuous aim (spring per axis); the hit is the panel's
 * plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const PT = 40, SX = -6, SY = 8, L = 35, REST = [-0.4, 0.22];
const shift = (ring, du, dv) => ring.map((q) => ({ ...q, u: q.u + du, v: q.v + dv }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-26, -22, 0], [26, 22, 0], [-26, -22, 94], [26, -4, 94], [26, 22, PT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-26, -22, 26, 22, 5, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, PT));
  const [ur, ui] = rings(-26, -22, 26, -4, 5, 1.6);
  put(solid(g), prism(P, front, ur, ui, PT, 94));
  const sc = (x, z) => P(x, -4, z);
  mk("path", { class: "sil", d: poly([sc(-20, 48), sc(20, 48), sc(20, 86), sc(-20, 86)]) }, g);
  mk("path", { class: "nf lo", d: seg(sc(-17, 54), sc(17, 54)) }, g);
  const sprite = mk("path", { class: "nf" }, g);
  for (const [u, v] of [[10, 4], [16, 12]]) put(solid(g), prism(P, front, shift(circ(3.6, 20), u, v), shift(circ(2.6, 20), u, v), PT, PT + 2.2));
  put(solid(g), prism(P, front, shift(circ(4.5, 24), SX, SY), shift(circ(3.4, 24), SX, SY), PT, PT + 1.5));
  const shaft = mk("path", { class: "nf sil" }, g);
  const ball = mk("ellipse", { class: "sil hi", rx: 7.5 * C.S, ry: 7.5 * C.S }, g);
  const ax = spring(REST[0]), ay = spring(REST[1]);
  let drawn = "", gain = value;

  function draw() {
    const a = ax.x, b = ay.x, key = a.toFixed(4) + b.toFixed(4);
    if (key === drawn) return;
    drawn = key;
    const top = [SX + L * Math.sin(a), SY + L * Math.sin(b), PT + 1.5 + L * Math.cos(Math.hypot(a, b))];
    shaft.setAttribute("d", seg(P(SX, SY, PT + 1.5), P(top[0], top[1], top[2] - 6)));
    place(ball, P(...top));
    const px = clamp((a - b) * 30, -8, 8), pz = clamp(67 - (a + b) * 24, 59, 75);
    sprite.setAttribute("d", poly([sc(px - 11, pz - 10), sc(px + 11, pz - 10), sc(px + 11, pz + 10), sc(px - 11, pz + 10)]));
  }
  const B = register(stage, (dt) => { const m1 = stepS(ax, dt), m2 = stepS(ay, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { ax.t = REST[0]; ay.t = REST[1]; read.textContent = "rest"; return B.wake(); }
    const [x, y] = unproj(C, p[0], p[1], PT), dx = x - SX, dy = y - SY, d = Math.hypot(dx, dy) || 1;
    const m = clamp(d / 30, 0, 1) * 1.05 * gain;
    ax.t = (dx / d) * m; ay.t = (dy / d) * m;
    const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "R" : "L") : dy > 0 ? "D" : "U";
    read.textContent = m < 0.1 ? "mid" : "stick " + dir;
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => aim(p[0] < 40 || p[0] > 360 || p[1] < 20 || p[1] > 305 ? null : p),
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null); draw();
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "arcadestick",
  means: "A bartop arcade cabinet: its ball-top stick leans toward the pointer and the sprite on the screen slides along.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[214, 209], [108, 206], [164, 140], null],
  mount,
});
