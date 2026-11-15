/**
 * Tank hood: an aquarium on a stand with its hood hinged along the back top
 * edge. The pointer over the tank lifts the hood, wider the nearer the front
 * the pointer comes. At rest the hood sits a little ajar, bright. The slider
 * is the widest opening.
 *
 * The pattern: one lid turning on a hinge (open).
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const D = 66, Wd = 120, H = 64, HD = 68, HH = 9, REST = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[-4, -4, -6], [D + 4, Wd + 4, -6], [D + 4, -4, -6], [-4, Wd + 4, -6], [0, 0, H + HD + 6], [0, Wd, H + HD + 6]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, D + 4, Wd + 4, 3, 1.5);
  put(solid(g), prism(P, front, br, bi, -6, 0));
  const [tr, ti] = rings(0, 0, D, Wd, 1.5, 1.2);
  put(solid(g), prism(P, front, tr, ti, 0, H));
  let d = seg(P(D, 0, H - 10), P(D, Wd, H - 10)) + seg(P(D, Wd, H - 10), P(0, Wd, H - 10));
  mk("path", { d, class: "nf dash" }, g);
  d = "";
  for (const [y, h] of [[18, 16], [30, 24], [42, 13], [92, 20], [102, 28]]) d += seg(P(D, y, 6), P(D, y + 2, 6 + h)) + seg(P(D, y + 2, 6 + h), P(D, y + 5, 6 + h * 0.6));
  d += seg(P(D, 0, 6), P(D, Wd, 6)) + seg(P(D, Wd, 6), P(0, Wd, 6));
  mk("path", { d, class: "nf lo" }, g);

  const hood = mk("g", {}, g);
  const sil = mk("path", { class: "sil hi" }, hood), faces = mk("path", { class: "nf lo" }, hood);
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const at = (x, y, dz) => P(x * c - dz * s, y, H + x * s + dz * c);
    const pts = [];
    for (const x of [-1, HD]) for (const y of [-1, Wd + 1]) for (const dz of [0, HH]) pts.push(at(x, y, dz));
    sil.setAttribute("d", poly(hull(pts)));
    const q = (a1, b1, c1, d1) => poly([a1, b1, c1, d1]);
    faces.setAttribute("d",
      q(at(-1, -1, HH), at(HD, -1, HH), at(HD, Wd + 1, HH), at(-1, Wd + 1, HH)) +
      q(at(HD, -1, 0), at(HD, Wd + 1, 0), at(HD, Wd + 1, HH), at(HD, -1, HH)) +
      seg(at(HD - 14, 10, HH), at(HD - 14, 34, HH)));
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
    read.textContent = !p || a === REST ? "rest" : "open " + a + "°";
    B.wake();
  }
  lift(null);
  bag.add(pointer(stage, { move: lift, leave: () => lift(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; tgt = null; lift(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "aquariumlid",
  means: "An aquarium whose hood is hinged at the back: it lifts as the pointer comes over the tank, wider nearer the front.",
  rules: [1, 3, 5, 6],
  range: [30, 62, 80],
  tour: [[229, 175], [165, 143], [292, 143], null],
  mount,
});
