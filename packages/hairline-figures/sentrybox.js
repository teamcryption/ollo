/**
 * Sentry box: a guard hut with a flat overhanging roof, a slot window on its
 * side and a tall door on the front. The door swings on its hinge to follow
 * the pointer round the doorstep, from shut to wide open. At rest it stands
 * ajar, its window bright. The slider is how far the door may open.
 *
 * The pattern: a part swinging to face the pointer.
 */
const {
  Cam, clamp, fit, facing, poly, prism, proj, rad, rings, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 36, D = 36, H = 82, HX = 7, DW = 22, DZ = 64, REST = rad(28);
const turn = (ring, a, cx, cy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxOpen = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-6, -6, 0], [W + 6, -6, 0], [-6, D + 30, 0], [HX + 2, D + DW + 2, 0], [W + 6, D + 6, 0], [-6, -6, H + 10], [W + 6, D + 6, H + 10]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-4, -4, W + 4, D + 8, 3, 1.4), 0, 3));
  put(solid(g), prism(P, front, ...rings(0, 0, W, D, 3, 1.4), 3, H));
  const face = (pts) => poly(pts.map(([x, y, z]) => P(x, y, z)));
  mk("path", { d: face([[HX, D, 4], [HX + DW, D, 4], [HX + DW, D, DZ], [HX, D, DZ]]), class: "nf lo" }, g);
  mk("path", { d: face([[W, 8, 50], [W, 28, 50], [W, 28, 62], [W, 8, 62]]), class: "nf lo" }, g);
  put(solid(g), prism(P, front, ...rings(-5, -5, W + 5, D + 5, 3, 1.6), H, H + 5));
  put(solid(g), prism(P, front, ...rings(4, 4, W - 4, D - 4, 3, 1.4), H + 5, H + 9));
  const door = solid(g), win = mk("path", { class: "nf hi" }, g), knob = mk("path", { class: "nf lo" }, g);
  const [dR, dI] = [rrect(0, -1.2, DW, 1.2, 1, 4), rrect(0.6, -0.6, DW - 0.6, 0.6, 0.5, 4)];
  const a = spring(REST);
  let last = NaN;

  function onDoor(ang, u, z) { return P(HX + u * Math.cos(ang) - 1.4 * Math.sin(ang), D + u * Math.sin(ang) + 1.4 * Math.cos(ang), z); }
  function draw() {
    if (a.x === last) return;
    last = a.x;
    const ang = a.x;
    put(door, prism(P, front, turn(dR, ang, HX, D + 1.2), turn(dI, ang, HX, D + 1.2), 4, DZ));
    win.setAttribute("d", poly([onDoor(ang, 5, 44), onDoor(ang, 17, 44), onDoor(ang, 17, 58), onDoor(ang, 5, 58)]));
    const k = onDoor(ang, 18.5, 32);
    knob.setAttribute("d", poly([[k[0] - 1.2, k[1] - 1.2], [k[0] + 1.2, k[1] - 1.2], [k[0] + 1.2, k[1] + 1.2], [k[0] - 1.2, k[1] + 1.2]]));
  }

  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [gx, gy] = unproj(C, sx, sy, 30);
    const t = Math.atan2(gy - D, gx - HX);
    a.t = clamp(t < -Math.PI / 2 ? Math.PI : t, 0, rad(maxOpen));
    read.textContent = "open " + Math.round((a.t * 180) / Math.PI) + "°";
    B.wake();
  }
  function leave() { a.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  draw();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxOpen = v; }, destroy: bag.dispose };
}

hairline({
  name: "sentrybox",
  means: "A guard hut with a flat roof and a tall front door: the door swings on its hinge to follow the pointer round the step.",
  rules: [1, 3, 5, 8],
  range: [60, 100, 120],
  tour: [[108, 227], [214, 236], [102, 190], null],
  mount,
});
