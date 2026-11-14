/**
 * Site cabin: a steel office container on two skids, a window on its long
 * side and a door beside it. The pointer over the cabin swings the door open
 * on its hinge; leaving lets it fall back ajar. At rest the door stands a
 * little open, bright. The slider is how far it swings.
 *
 * The pattern: one part answering whether the pointer is over the object.
 */
const {
  Cam, clamp, fit, facing, poly, prism, proj, rings, rrect, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 84, D = 32, Z0 = 5, H = 32, HX = 52, DW = 14, AJAR = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wide = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-8, -8, 0], [L + 8, D + 8, 0], [L + 8, -8, 0], [-8, D + 20, 0], [0, 0, Z0 + H + 3], [L, D, Z0 + H + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-8, -8, L + 8, D + 20, 6, 2);
  put(solid(g), prism(P, front, gr, gi, 0, 2));
  for (const y of [4, D - 4]) { const [a, i] = rings(-1, y - 2.5, L + 1, y + 2.5, 1.5, 0.8); put(solid(g), prism(P, front, a, i, 2, Z0)); }
  const [br, bi] = rings(0, 0, L, D, 2.5, 1.6);
  put(solid(g), prism(P, front, br, bi, Z0, Z0 + H));
  const [rr, ri] = rings(-2, -2, L + 2, D + 2, 3, 1.4);
  put(solid(g), prism(P, front, rr, ri, Z0 + H, Z0 + H + 2.5));

  // marks on the near faces: ribs on the long side, a window, the doorway
  const face = (pts) => poly(pts.map(([x, z]) => P(x, D, z)));
  const side = (pts) => poly(pts.map(([y, z]) => P(L, y, z)));
  const win = (x0, x1, z0, z1) => face(rrect(x0, z0, x1, z1, 1.5, 3).map((q) => [q.u, q.v]));
  mk("path", { class: "lo nf", d: win(12, 38, Z0 + 14, Z0 + 25) }, g);
  mk("path", { class: "lo nf", d: side(rrect(9, Z0 + 14, D - 9, Z0 + 25, 1.5, 3).map((q) => [q.u, q.v])) }, g);
  mk("path", { class: "lo nf", d: face([[HX, Z0 + 2], [HX + DW, Z0 + 2], [HX + DW, Z0 + 27], [HX, Z0 + 27]]) }, g);
  const step = solid(mk("g", {}, g));
  const [sr, si] = rings(HX - 2, D, HX + DW + 2, D + 8, 1.5, 1);
  put(step, prism(P, front, sr, si, 2, Z0));

  const door = mk("path", { class: "sil" }, g), edge = mk("path", { class: "lo nf" }, g), knob = mk("path", { class: "lo nf" }, g);
  const ang = tween(AJAR);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const t = (a * Math.PI) / 180, ex = HX + DW * Math.cos(t), ey = D + DW * Math.sin(t);
    const tx = -1.2 * Math.sin(t), ty = 1.2 * Math.cos(t);
    const q = (x, y, z) => P(x, y, z);
    door.setAttribute("d", poly([q(HX, D, Z0 + 2), q(ex, ey, Z0 + 2), q(ex + tx, ey + ty, Z0 + 2), q(ex + tx, ey + ty, Z0 + 27), q(HX + tx, D + ty, Z0 + 27), q(HX, D, Z0 + 27)]));
    edge.setAttribute("d", "M" + q(ex, ey, Z0 + 2).join(",") + "L" + q(ex, ey, Z0 + 27).join(",") + "L" + q(HX, D, Z0 + 27).join(","));
    const k = 0.82, kx = HX + DW * k * Math.cos(t) + tx, ky = D + DW * k * Math.sin(t) + ty;
    knob.setAttribute("d", "M" + q(kx, ky, Z0 + 13).join(",") + "L" + q(kx, ky, Z0 + 16).join(","));
  }
  door.classList.add("hi");

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let inside = null;
  function aim(p) {
    let on = false;
    if (p) { const [wx, wy] = unproj(C, p[0], p[1], 0); on = wx > -10 && wx < L + 10 && wy > -10 && wy < D + 24; }
    if (on === inside) return;
    inside = on;
    tset(ang, on ? clamp(wide, AJAR, 120) : AJAR, performance.now(), 0);
    read.textContent = on ? "open " + Math.round(wide) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wide = v; if (inside) { inside = null; } }, destroy: bag.dispose };
}

hairline({
  name: "sitecabin",
  means: "A steel site cabin on skids: the pointer over it swings the door open on its hinge, and leaving lets it fall back ajar.",
  rules: [1, 4, 5, 8],
  range: [50, 95, 120],
  tour: [[150, 160], [240, 200], [200, 140], null],
  mount,
});
