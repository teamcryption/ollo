/**
 * Barrel hoop: a cooper's barrel standing on its chime, bellied in the
 * middle, with a hoop and the hoop driver resting on it. The pointer's
 * height over the barrel drives the hoop down the staves (it grows with the
 * belly as it goes), the driver riding on its top edge. At rest the hoop
 * sits loose near the head, bright.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, clamp,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const H = 84, R0 = 23, RM = 29, REST = H - 12, BAND = 5;
const rz = (z) => R0 + (RM - R0) * Math.sin(Math.PI * clamp(z / H, 0, 1));
const ring = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let low = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-RM - 4, -RM - 4, 0], [RM + 4, RM + 4, 0], [RM + 4, -RM - 4, 0], [-RM - 4, RM + 4, 0], [0, 0, H + 4], [24, 24, H + 40]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-RM - 8, -RM - 8, RM + 8, RM + 8, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  const prof = [];
  for (let i = 0; i <= 12; i++) { const z = (i / 12) * H; prof.push(...ringAt(P, ring(rz(z)), 3 + z)); }
  const barrel = solid(g);
  barrel.sil.setAttribute("d", poly(hull(prof)));
  barrel.cr.setAttribute("d", poly(ringAt(P, ring(R0 - 2.5), 3 + H)));
  // the fixed bottom hoop and the staves' joints: dim front arcs
  for (const z of [8, 13]) mk("path", { d: open(ringAt(P, run(ring(rz(z) + 0.4), front), 3 + z)), class: "nf lo" }, g);
  for (const a of [-0.55, 0.05, 0.6, 1.15, 1.75]) {
    const t = Math.PI / 4 + a, pts = [];
    for (let i = 1; i < 12; i++) { const z = (i / 12) * H; pts.push(P(rz(z) * Math.cos(t), rz(z) * Math.sin(t), 3 + z)); }
    mk("path", { d: open(pts), class: "nf lo" }, g);
  }
  const hoop = mk("path", { class: "sil hi" }, g);
  const drv = solid(g), blade = mk("path", { class: "nf lo" }, g);

  const zt = spring(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    const r1 = rz(z) + 0.8, r2 = rz(z + BAND) + 0.8;
    const lo = ringAt(P, run(ring(r1), front), 3 + z), hi = ringAt(P, run(ring(r2), front), 3 + z + BAND);
    hoop.setAttribute("d", poly(lo.concat(hi.reverse())));
    const c = (r2 + 3) * Math.SQRT1_2, z0 = 3 + z + BAND;
    const [dr, di] = rings(c - 3, c - 3, c + 3, c + 3, 1.5, 0.6);
    put(drv, prism(P, front, dr, di, z0, z0 + 44));
    blade.setAttribute("d", open([P(c - 3, c + 3, z0 + 10), P(c + 3, c - 3, z0 + 10)]));
  }

  const B = register(stage, (dt) => { const m = stepS(zt, dt); draw(zt.x); return m; });
  bag.add(B.unregister);

  const o = P(0, 0, 3), u = P(0, 0, 4);
  const per = o[1] - u[1];
  function aim([sx, sy]) {
    if (Math.abs(sx - o[0]) > RM * 2.4 || sy > o[1] + 40 || sy < o[1] - (H + 50) * per) return null;
    return clamp((o[1] - sy) / per - 8, low, REST);
  }
  function setAim(z) {
    zt.t = z === null ? REST : z;
    read.textContent = z === null ? "rest" : "hoop " + Math.round(z);
    B.wake();
  }
  draw(REST);
  setAim(null);
  bag.add(pointer(stage, { move: (p) => setAim(aim(p)), leave: () => setAim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { low = v; }, destroy: bag.dispose };
}

hairline({
  name: "cooperhoop",
  means: "A cooper's barrel: the hoop driver drives the hoop down the staves to the pointer's height, the hoop growing with the belly.",
  rules: [1, 3, 5, 8],
  range: [20, 30, 50],
  tour: [[200, 208], [200, 242], [200, 175], null],
  mount,
});
