/**
 * Kitesurf rig: a board on the water, the control bar above it and two lines
 * running up to a curved arc kite. The pointer's side of the frame steers the
 * kite: it sweeps across the wind window and dips low at its edges, on a
 * spring. At rest it flies off to one side, its leading edge bright. The
 * slider is how far the kite may sweep.
 *
 * The pattern: one part swinging to follow the pointer.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 26, LN = 105, R = 40, CH = 15, BASE = Math.PI * 1.25, REST = 0.45, MAXS = 1.25;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = (value * Math.PI) / 180;
  const C = Cam(45, 0.5, 1.8);
  function kite(sw) {
    const el = 1.0 - 0.45 * Math.abs(sw) / MAXS, ph = BASE + sw;
    const u = [Math.cos(el) * Math.cos(ph), Math.cos(el) * Math.sin(ph), Math.sin(el)], s = [-Math.sin(ph), Math.cos(ph), 0];
    const c = [u[1] * s[2] - u[2] * s[1], u[2] * s[0] - u[0] * s[2], u[0] * s[1] - u[1] * s[0]];
    const at = (psi, ch) => [0, 1, 2].map((k) => (k === 2 ? BZ : 0) + u[k] * LN + R * Math.sin(psi) * s[k] - R * (1 - Math.cos(psi)) * u[k] + ch * c[k]);
    return { at, s };
  }
  const ext = [];
  for (const sw of [-MAXS, -0.6, 0, 0.6, MAXS]) { const k = kite(sw); for (const p of [-1.3, 0, 1.3]) for (const h of [-CH, 0, CH]) ext.push(k.at(p, h)); }
  fit(C, ext.concat([[-26, -9, 0], [26, 9, 0]]), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const canopy = mk("path", { class: "sil" }, g), struts = mk("path", { class: "nf lo" }, g), le = mk("path", { class: "nf hi" }, g), lines = mk("path", { class: "nf lo" }, g);
  const [br, bi] = rings(-26, -9, 26, 9, 8, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, 2));
  mk("path", { d: open([P(-6, -11, BZ), P(-6, 11, BZ)]), class: "sil" }, g);
  mk("path", { d: seg(P(-6, -5, 2), P(-6, -5, BZ)) , class: "dash nf" }, g);

  const sp = spring(REST);
  let last = NaN;
  function draw(sw) {
    if (sw === last) return;
    last = sw;
    const k = kite(sw), lead = [], trail = [];
    for (let i = 0; i <= 16; i++) { const psi = -1.3 + (2.6 * i) / 16; lead.push(P(...k.at(psi, 0))); trail.push(P(...k.at(psi * 0.96, CH * Math.cos(psi * 0.8)))); }
    canopy.setAttribute("d", poly(lead.concat(trail.reverse())));
    let d = "";
    for (const psi of [-0.78, -0.26, 0.26, 0.78]) d += seg(P(...k.at(psi, 0)), P(...k.at(psi * 0.96, CH * Math.cos(psi * 0.8))));
    struts.setAttribute("d", d);
    le.setAttribute("d", open(lead));
    const t0 = k.at(-1.3, CH * 0.3), t1 = k.at(1.3, CH * 0.3);
    lines.setAttribute("d", seg(P(-6, -10, BZ), P(...(k.s[1] > 0 ? t0 : t1))) + seg(P(-6, 10, BZ), P(...(k.s[1] > 0 ? t1 : t0))));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  let act = null;
  function setAim(p) {
    act = p;
    sp.t = p ? clamp((p[0] - 200) / 130, -1, 1) * reach : REST;
    read.textContent = p ? (sp.t < 0 ? "L " : "R ") + Math.round(Math.abs(sp.t) * 180 / Math.PI) + "°" : "rest";
    B.wake();
  }
  setAim(null);
  draw(sp.x);
  bag.add(pointer(stage, { move: setAim, leave: () => setAim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp((v * Math.PI) / 180, 0, MAXS); if (act) setAim(act); }, destroy: bag.dispose };
}

hairline({
  name: "kitesurf",
  means: "A kitesurf rig, board, bar and arc kite: the kite sweeps across the wind window toward the pointer's side, as far as the slider lets it.",
  rules: [1, 3, 5, 8],
  range: [20, 65, 70],
  tour: [[60, 120], [340, 120], [60, 120], null],
  mount,
});
