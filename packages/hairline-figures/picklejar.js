/**
 * Pickle crock: a stoneware fermenting crock with a water-moat collar and
 * two side lugs. The heavy lid lifts out of the moat and slides aside as the
 * pointer comes over the crock, showing the dark mouth. At rest the lid sits
 * a crack open, bright. The slider is how far it lifts.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, unproj, clamp, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const R = 30, H = 44, MZ = 50, LR = 27;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-R - 8, -R - 8, 0], [R + 8, R + 8, 0], [R + 8, -R - 8, 0], [-R - 8, R + 8, 0], [24, -24, 115], [-R, -R, 115]], 200, 140);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // side lugs, half hidden by the body
  for (const s of [1, -1]) { const lx = s * 24, ly = -s * 24; put(solid(g), prism(P, front, disc(lx, ly, 7, 20), disc(lx, ly, 5, 20), 30, 36)); }
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 2), 0, H));
  // shoulder and moat collar
  put(solid(g), prism(P, front, disc(0, 0, R + 4), disc(0, 0, R + 1), H, H + 6));
  mk("path", { d: poly(ringAt(P, disc(0, 0, LR + 1), H + 6)), class: "nf lo" }, g);
  const mouth = mk("path", { d: poly(ringAt(P, disc(0, 0, LR - 3), H + 6)), class: "lo" }, g);
  const lid = solid(g), knob = solid(g);
  lid.sil.classList.add("hi");
  const sp = spring(0.1);
  let last = NaN;
  function draw(a) {
    if (a === last) return; last = a;
    const lift = a * reach, dx = 0.55 * lift, dy = -0.55 * lift, z0 = H + 3 + lift;
    put(lid, prism(P, front, disc(dx, dy, LR), disc(dx, dy, LR - 2), z0, z0 + 5));
    const top = z0 + 5 + 1.6 * Math.max(0, 1);
    const dome = [];
    for (const [r, z] of [[LR - 2, 0], [LR - 8, 3], [LR - 16, 5]]) dome.push(...ringAt(P, disc(dx, dy, r, 30), z0 + 5 + z));
    lid.cr.setAttribute("d", poly(hull(dome)));
    put(knob, prism(P, front, disc(dx, dy, 5, 20), disc(dx, dy, 3.5, 20), top + 3, top + 10));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, H);
    const d = Math.hypot(wx, wy), a = clamp(1 - (d - 20) / 60, 0, 1);
    sp.t = Math.max(0.1, a);
    read.textContent = a > 0 ? "lid " + Math.round(a * 100) : "rest";
    B.wake();
  }
  function leave() { sp.t = 0.1; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  draw(sp.x);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; draw(sp.x); }, destroy: bag.dispose };
}
const { ringAt } = HL;

hairline({
  name: "picklejar",
  means: "A stoneware fermenting crock: its heavy lid lifts out of the water moat and slides aside as the pointer comes over the crock.",
  rules: [1, 3, 5, 6],
  range: [16, 36, 44],
  tour: [[200, 149], [168, 190], [236, 160], null],
  mount,
});
