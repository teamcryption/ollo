/**
 * Hedgehog house: a low wooden box with an arched doorway and a pitched
 * roof hinged along its back edge. The pointer over the house lifts the
 * roof, wider the nearer the front it comes, to show the straw nest. At
 * rest the roof sits a little ajar, bright. The slider is the widest opening.
 *
 * The pattern: one lid turning on a hinge (open).
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const D = 70, Wd = 92, H = 38, RH = 24, OV = 6, REST = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-6, -6, -4], [D + 6, Wd + 6, -4], [D + 6, -6, -4], [-6, Wd + 6, -4], [-OV, 0, H + D + 2 * OV + 4], [-OV, Wd, H + D + 2 * OV + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, D + 6, Wd + 6, 3, 1.5);
  put(solid(g), prism(P, front, br, bi, -4, 0));
  const [tr, ti] = rings(0, 0, D, Wd, 1.5, 1.2);
  put(solid(g), prism(P, front, tr, ti, 0, H));
  // the doorway: an arch on the front-left face, with a step of shadow line
  const arch = [];
  const yc = Wd, xc = D * 0.55, ar = 11;
  for (let i = 0; i <= 12; i++) { const t = Math.PI * i / 12; arch.push(P(xc + ar * Math.cos(t), yc, 2 + 14 + ar * Math.sin(t) * 0.9)); }
  arch.unshift(P(xc + ar, yc, 2)); arch.push(P(xc - ar, yc, 2));
  mk("path", { d: poly(arch), class: "nf" }, g);
  // straw nest on the floor, seen when the roof lifts
  let d = "";
  for (const [x, y, l] of [[18, 22, 16], [30, 40, 20], [44, 30, 14], [24, 60, 18], [46, 64, 16], [36, 52, 12]]) d += seg(P(x, y, H), P(x + l * 0.5, y + l, H));
  mk("path", { d, class: "nf lo" }, g);

  const roof = mk("g", {}, g);
  const sil = mk("path", { class: "sil hi" }, roof), faces = mk("path", { class: "nf lo" }, roof);
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    // local x from the hinge at the back edge, dz up from the box top
    const at = (x, y, dz) => P(-OV + x * c - dz * s, y, H + x * s + dz * c);
    const L = D + 2 * OV, prof = [[0, 0], [L / 2, RH], [L, 0]], pts = [];
    for (const [x, dz] of prof) for (const y of [-OV, Wd + OV]) pts.push(at(x, y, dz));
    sil.setAttribute("d", poly(hull(pts)));
    faces.setAttribute("d",
      seg(at(L / 2, -OV, RH), at(L / 2, Wd + OV, RH)) +
      poly([at(0, Wd + OV, 0), at(L / 2, Wd + OV, RH), at(L, Wd + OV, 0)]));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let tgt = null, lastP = null;
  function lift(p) {
    lastP = p;
    let a = REST;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], H);
      if (wy > -30 && wy < Wd + 30 && wx > -40 && wx < D + 50) a = maxA * clamp((wx + 30) / (D + 40), 0.3, 1);
    }
    a = Math.round(a);
    if (a === tgt) return;
    tgt = a;
    ang.t = a;
    read.textContent = !p || a === REST ? "rest" : "roof " + a + "°";
    B.wake();
  }
  lift(null);
  bag.add(pointer(stage, { move: lift, leave: () => lift(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; tgt = null; lift(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "hedgehog",
  means: "A hedgehog house with an arched door: its pitched roof lifts on a back hinge as the pointer nears, to show the nest.",
  rules: [1, 3, 5, 6],
  range: [30, 70, 95],
  tour: [[194, 176], [238, 214], [251, 223], null],
  mount,
});
