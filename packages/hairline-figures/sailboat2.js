/**
 * Sun lounger: a poolside lounger on four legs, a seat cushion and a
 * backrest hinged at its head, propped on a strut. The pointer's place
 * along the lounger sets the recline: near the head the backrest sits up,
 * toward the foot it lies flat. At rest it is half-reclined, bright. The
 * slider is how far up the backrest may sit.
 *
 * The pattern: one part turning on a hinge (continuous).
 */
const {
  Cam, clamp, fillet, fit, facing, hull, lerp, open, poly, prism, proj, rad, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 44, FZ = 12, HX = 44, L = 58, T = 4, REST = 32;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-18, 0, 0], [124, W, 0], [124, 0, 0], [-18, W, 0], [HX - 12, 0, 78], [HX - 12, W, 78]], 200, 170);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const leg = (x, y) => { const [a, b] = rings(x - 2.5, y - 2.5, x + 2.5, y + 2.5, 2, 0.8); put(solid(g), prism(P, front, a, b, 0, FZ)); };
  leg(8, 5); leg(8, W - 5);
  // the frame: a long thin rail plate under both cushions
  const [fr, fi] = rings(0, 0, 120, W, 5, 1.6);
  const back = mk("g", {}, g);
  const strut = mk("path", { class: "nf lo" }, back);
  const rest = mk("path", { class: "sil" }, back), restCr = mk("path", { class: "nf lo" }, back), pillow = mk("path", { class: "nf" }, back);
  leg(112, 5); leg(112, W - 5);
  put(solid(g), prism(P, front, fr, fi, FZ, FZ + 2.4));
  const [sr, si] = rings(HX + 1, 2, 118, W - 2, 6, 2.2);
  put(solid(g), prism(P, front, sr, si, FZ + 2.4, FZ + 2.4 + T));
  // seat slats: three dim seams across the cushion
  const seams = mk("path", { class: "nf lo" }, g);
  seams.setAttribute("d", [62, 82, 100].map((x) => seg(P(x, 5, FZ + 2.4 + T), P(x, W - 5, FZ + 2.4 + T))).join(""));
  const hz = FZ + 2.4;
  let last = NaN, on = false;
  function draw(a) {
    a = Math.round(a * 10) / 10;
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const pt = (u, y, t) => P(HX - u * c + t * s, y, hz + u * s + t * c);
    const pts = [];
    for (const y of [2, W - 2]) for (const u of [0, L]) for (const t of [0, T]) pts.push(pt(u, y, t));
    const h = hull(pts);
    rest.setAttribute("d", poly(fillet(h, h.map(() => 2.5), 3)));
    restCr.setAttribute("d", open([pt(3, 4.5, T), pt(L - 3, 4.5, T), pt(L - 3, W - 4.5, T)]));
    const pp = [];
    for (const y of [9, W - 9]) for (const u of [L - 14, L - 3]) for (const t of [T, T + 4]) pp.push(pt(u, y, t));
    const ph = hull(pp);
    pillow.setAttribute("d", poly(fillet(ph, ph.map(() => 2), 3)));
    // the strut: from the frame up to the backrest's middle, on both sides
    const sx = HX - 34;
    strut.setAttribute("d", seg(P(sx, 3, hz), pt(L * 0.55, 3, 0)) + seg(P(sx, W - 3, hz), pt(L * 0.55, W - 3, 0)));
    read.textContent = on ? Math.round(a) + "°" : "rest";
  }
  const ang = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function aim(p) {
    on = !!p; last = NaN;
    if (!p) { ang.t = REST; rest.classList.add("hi"); B.wake(); return; }
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    if (wy < -30 || wy > W + 30 || wx < -40 || wx > 150) return aim(null);
    ang.t = clamp(lerp(maxA, 4, (wx + 10) / 130), 4, maxA);
    B.wake();
  }
  rest.classList.add("hi");
  draw(REST);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "sailboat2",
  means: "A poolside sun lounger: the pointer's place along it sets the recline, sitting the backrest up near the head or laying it flat.",
  rules: [1, 3, 5, 8],
  range: [45, 62, 80],
  tour: [[154, 128], [285, 231], [120, 145], null],
  mount,
});
