/**
 * EV charger: a charging post with a screen and a holster, its plug on a
 * heavy cable. The plug swings out on its cable toward the pointer, the cable
 * sagging to the ground between. At rest the plug sits in its holster with
 * the cable looped below, and the plug is bright. The slider is the reach.
 */
const { Cam, clamp, fit, facing, open, poly, prism, proj, rings, rrect, unproj, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const W = 22, D = 14, H = 60, DOCK = [W / 2, D + 4, 36], BASE = [W / 2, D, 22];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.62);
  fit(C, [[0, 0, 0], [W, 0, H], [0, D, H], [W + 34, D + 4, 0], [-24, D + 36, 0], [W, D + 36, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, H));
  mk("path", { d: poly(rrect(3, 46, W - 3, 58, 1.4, 3).map((q) => P(q.u, D, q.v))), class: "nf lo" }, g);
  mk("path", { d: poly(rrect(5, 32, W - 5, 42, 1.4, 3).map((q) => P(q.u, D, q.v))), class: "nf lo" }, g);
  const cable = mk("path", { class: "nf" }, g);
  const plug = solid(g);
  const nose = mk("path", { class: "nf lo" }, plug.g);
  const sx = spring(DOCK[0]), sy = spring(DOCK[1]), sz = spring(DOCK[2]);
  let last = "";
  function draw(x, y, z) {
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20, sag = 4 * t * (1 - t) * (z > 30 ? 34 : 24 + Math.hypot(x - BASE[0], y - BASE[1]) * 0.25);
      pts.push(P(lerp(BASE[0], x, t), lerp(BASE[1] + 0.5, y, t) + 4 * t * (1 - t) * 26, Math.max(0.6, lerp(BASE[2], z, t) - sag)));
    }
    cable.setAttribute("d", open(pts));
    const [r, i] = rings(x - 3.2, y - 3.2, x + 3.2, y + 3.2, 2.2, 0.8);
    put(plug, prism(P, front, r, i, z, z + 9));
    nose.setAttribute("d", seg(P(x, y + 3.2, z + 3), P(x, y + 3.2, z + 7)));
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  plug.sil.classList.add("hi");
  const L = register(stage, (dt) => {
    const m = stepS(sx, dt) | stepS(sy, dt) | stepS(sz, dt);
    const k = `${sx.x},${sy.x},${sz.x}`;
    if (k !== last) { draw(sx.x, sy.x, sz.x); last = k; }
    return !!m;
  });
  bag.add(L.unregister);
  function aim(p) {
    if (!p) { sx.t = DOCK[0]; sy.t = DOCK[1]; sz.t = DOCK[2]; read.textContent = "rest"; L.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    const R = 34 * reach, dx = x - BASE[0], dy = y - D, d = Math.hypot(dx, dy) || 1, f = Math.min(1, R / d);
    sx.t = clamp(BASE[0] + dx * f, -24, W + 34);
    sy.t = clamp(D + dy * f, D + 6, D + 36);
    sz.t = 14;
    read.textContent = `${Math.round(Math.hypot(sx.t - BASE[0], sy.t - D))}`;
    L.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "evcharger",
  means: "An EV charger post: its plug swings out on the heavy cable toward the pointer, the cable sagging to the ground between.",
  rules: [1, 3, 4, 5],
  range: [0.4, 1, 1],
  tour: [[195, 281], [103, 224], [323, 293], null],
  mount,
});
