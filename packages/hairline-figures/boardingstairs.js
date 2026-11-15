/**
 * Boarding stairs: an airstairs truck, a low chassis and a cab, carrying a
 * flight of steps hinged behind the cab. The pointer along the truck tilts the
 * flight up toward an aircraft door. At rest the flight lies half raised, bright.
 */
const { Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, seg, clamp, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid, unproj } = HL;

const L = 80, W = 24, CZ = 14, PX = 52, SL = 64, Y0 = 4, Y1 = 20, REST = 0.32, MAX = 0.85;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [PX - SL * Math.cos(MAX), W / 2, CZ + SL * Math.sin(MAX) + 12]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ch, ci] = rings(0, 0, L, W, 3, 1.2);
  put(solid(g), prism(P, front, ch, ci, 6, CZ));
  const sg = mk("g", {}, g);
  const side = mk("path", { class: "sil hi" }, sg), steps = mk("path", { class: "nf" }, sg), rail = mk("path", { class: "nf lo" }, sg);
  const [cr, cri] = rings(PX + 4, 0, L, W, 4, 1.4);
  put(solid(g), prism(P, front, cr, cri, CZ, 34));
  const wheel = (x) => circ(6, 24).map((q) => P(x + q.u, W, 6 + q.v));
  for (const x of [14, 66]) put(solid(g), { sil: poly(wheel(x)), crease: poly(circ(2.5, 16).map((q) => P(x + q.u, W, 6 + q.v))) });
  const ang = tween(REST);
  const at = (s, y, a, dz = 0) => P(PX - s * Math.cos(a) - dz * Math.sin(a), y, CZ + 2 + s * Math.sin(a) + dz * Math.cos(a));
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const y of [Y0, Y1]) for (const s of [0, SL]) for (const dz of [-3, 3]) pts.push(at(s, y, a, dz));
    side.setAttribute("d", poly(hull(pts)));
    let d = "";
    for (let i = 1; i < 12; i++) { const s = (i / 12) * SL; d += seg(at(s, Y0, a, 3), at(s, Y1, a, 3)); }
    steps.setAttribute("d", d);
    rail.setAttribute("d", open([0, SL].map((s) => at(s, Y1, a, 14))) + open([at(SL, Y1, a, 3), at(SL, Y1, a, 14)]) + open([at(0, Y1, a, 3), at(0, Y1, a, 14)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  function set(p) {
    const now = performance.now();
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x > -30 && x < L + 20 && y > -30 && y < W + 30) {
        const t = clamp(1 - x / L, 0, 1), a = clamp(0.1 + t * MAX * (0.5 + reach / 200), 0.1, MAX);
        tset(ang, a, now, 0);
        read.textContent = Math.round((a * 180) / Math.PI) + "\u00b0";
        B.wake();
        return;
      }
    }
    tset(ang, REST, now, 0);
    read.textContent = "rest";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "boardingstairs",
  means: "An airstairs truck: the flight of steps tilts up from the chassis toward a door as the pointer moves to the truck's tail.",
  rules: [1, 3, 4, 5],
  range: [0, 60, 100],
  tour: [[148, 145], [249, 279], [151, 189], null],
  mount,
});
