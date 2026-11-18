/**
 * Pressure washer: the unit on two back wheels with its tall handle, a hose
 * from its outlet to the trigger gun, and the long lance, hung down along the
 * front at rest. The pointer's height is where the lance aims: it swings up
 * on the gun's pivot on a spring and the spray fans from its nozzle. At rest
 * it hangs, the lance bright. The slider is how far it can swing.
 */
const { Cam, clamp, facing, fit, hull, lerp, open, poly, prism, proj, rings, seg, spring, stepS, mk, pointer, put, register, solid, disposer } = HL;

const PX = 15, PZ = 56, WL = 60, REST = -62;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-26, -20, 0], [-26, 20, 0], [76, 0, 0], [72, 0, 92], [-20, 0, 78], [14, 16, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  function ext(el, prof, y0, y1) {
    const pts = [], f = [];
    for (const [x, z] of prof) { pts.push(P(x, y0, z), P(x, y1, z)); f.push(P(x, y1, z)); }
    el.setAttribute("d", poly(hull(pts)) + poly(f));
  }
  const wheel = (y0, y1) => { const pr = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; pr.push([-18 + 10 * Math.cos(a), 10 + 10 * Math.sin(a)]); } ext(mk("path", { class: "sil" }, g), pr, y0, y1); };
  wheel(-20, -15);
  put(solid(g), prism(P, front, ...rings(-20, -3, -16, 3, 1.5, 0.6), 44, 74));
  put(solid(g), prism(P, front, ...rings(-23, -12, -13, 12, 3, 1), 72, 77));
  put(solid(g), prism(P, front, ...rings(-16, -14, 12, 14, 7, 1.8), 6, 50));
  put(solid(g), prism(P, front, ...rings(-10, -10, 6, 10, 5, 1.4), 50, 56));
  wheel(15, 20);
  const hose = mk("path", { class: "nf" }, g);
  const spray = mk("path", { class: "dash nf" }, g);
  const grip = mk("path", { class: "sil" }, g), gun = mk("path", { class: "sil" }, g), lance = mk("path", { class: "sil hi" }, g);
  function capsule(el, ax, az, bx, bz, r, hw) {
    const a = Math.atan2(bz - az, bx - ax), prof = [];
    for (let i = 0; i <= 8; i++) { const t = a - Math.PI / 2 + (Math.PI * i) / 8; prof.push([bx + r * Math.cos(t), bz + r * Math.sin(t)]); }
    for (let i = 0; i <= 8; i++) { const t = a + Math.PI / 2 + (Math.PI * i) / 8; prof.push([ax + r * Math.cos(t), az + r * Math.sin(t)]); }
    ext(el, prof, -hw, hw);
  }
  const t = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const at = (u, w) => [PX + u * c - w * s, PZ + u * s + w * c];
    const [g0x, g0z] = at(-12, 0), [g1x, g1z] = at(8, 0), [hx, hz] = at(-6, -14), [tx, tz] = at(WL, 0);
    capsule(grip, ...at(-6, 0), hx, hz, 2.6, 2.2);
    capsule(gun, g0x, g0z, g1x, g1z, 4.4, 3.4);
    capsule(lance, g1x, g1z, tx, tz, 2.2, 1.8);
    const hp = [];
    for (let i = 0; i <= 16; i++) { const u = i / 16, x = lerp(12, g0x, u), z = lerp(12, g0z, u) - 22 * Math.sin(Math.PI * u) * (1 - u * 0.4); hp.push(P(x, 8 * (1 - u), Math.max(1, z))); }
    hose.setAttribute("d", open(hp));
    const on = clamp((deg - REST) / 40, 0, 1);
    let d = "";
    if (on > 0.05) for (const k of [-1, 0, 1]) { const b = a + k * 0.16; d += seg(P(tx, 0, tz), P(tx + 22 * on * Math.cos(b), k * 4 * on, tz + 22 * on * Math.sin(b))); }
    spray.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(t, dt); draw(t.x); return m; });
  bag.add(B.unregister);
  const lo = P(40, 0, 0), hi = P(40, 0, 90), left = P(-26, 20, 0)[0], right = P(76, 0, 0)[0];
  function hit([sx, sy]) {
    if (sx < left - 10 || sx > right + 10 || sy < hi[1] - 20 || sy > P(14, 16, 0)[1] + 10) return -1;
    return clamp((lo[1] - sy) / (lo[1] - hi[1]), 0, 1);
  }
  let cur = -1;
  function set(v) {
    cur = v;
    t.t = v < 0 ? REST : REST + reach * lerp(30, 88, v);
    read.textContent = v < 0 ? "rest" : "aim " + Math.round(t.t) + "°";
    B.wake();
  }
  set(-1);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (cur >= 0) set(cur); }, destroy: bag.dispose };
}

hairline({
  name: "pressurewasher",
  means: "A pressure washer: the pointer's height swings the lance up on its trigger gun to aim, and the spray fans from the nozzle.",
  rules: [1, 3, 5, 6],
  range: [0.3, 1, 1],
  tour: [[250, 230], [276, 108], [265, 170], null],
  mount,
});
