/**
 * Viewfinder hood: a box medium-format camera with a lens on its front and a
 * waist-level finder on top, its lid hinged at the back. The pointer lifts the
 * lid: higher in the frame it stands open over the focusing screen, lower it
 * folds shut. At rest it stands ajar, bright. The slider is how stiffly it follows.
 *
 * The pattern: one hinged part following the pointer on a spring (open).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, rrect, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 26, H = 44, FT = H + 5, L = 21, REST = 38;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-W, -W, 0], [W, W + 16, 0], [W, -W, 0], [-W, W + 16, 0], [0, -L, FT + 2 * L + 2], [W, -W, FT + 2 * L]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-W, -W, W, W, 5, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const [fr, fi] = rings(-L, -L, L, L, 3, 1.2);
  put(solid(g), prism(P, front, fr, fi, H, FT));
  const [sr] = rings(-L + 4, -L + 4, L - 4, L - 4, 2, 1);
  mk("path", { d: poly(sr.map((q) => P(q.u, q.v, FT + 0.1))), class: "nf lo" }, g);
  // the lens, standing out of the front face along +y
  const lensAt = (R, y) => circ(R, 32).map((q) => P(q.u, y, H / 2 + q.v));
  for (const [R, y0, y1] of [[15, W, W + 6], [12, W + 6, W + 16]]) {
    mk("path", { d: poly(hull(lensAt(R, y0).concat(lensAt(R, y1)))), class: "sil" }, g);
    mk("path", { d: poly(lensAt(R - 1.5, y1)), class: "nf lo" }, g);
  }
  mk("path", { d: poly(lensAt(6, W + 16)), class: "nf lo" }, g);
  const lid = mk("path", { class: "sil hi" }, g), lidIn = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  const plate = rrect(-L, 0, L, 2 * L, 3, 4), inset = rrect(-L + 3, 3, L - 3, 2 * L - 3, 2, 4);
  let last = NaN;

  function draw() {
    const a = Math.round(ang.x * 20) / 20;
    if (a === last) return;
    last = a;
    const t = ((180 - a) * Math.PI) / 180, e2 = [0, Math.cos(t), Math.sin(t)], e3 = [0, -Math.sin(t), Math.cos(t)];
    const at = (ring, w) => ring.map((q) => P(q.u, L + e2[1] * q.v + e3[1] * w, FT + e2[2] * q.v + e3[2] * w));
    const a0 = at(plate, 0), a1 = at(plate, -1.6);
    lid.setAttribute("d", poly(hull(a0.concat(a1))));
    lidIn.setAttribute("d", a < 92 ? poly(at(inset, 0)) : poly(at(inset, -1.6)));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { ang.t = REST; read.textContent = "rest"; }
    else { ang.t = Math.round(clamp((250 - p[1]) / 1.4, 0, 105)); read.textContent = "lid " + ang.t + "°"; }
    lid.classList.toggle("hi", true);
    B.wake();
  }
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { ang.k = 100 * v; ang.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "viewfinder",
  means: "A box camera with a waist-level finder: the pointer lifts its hinged lid open over the screen or folds it shut.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[252, 40], [214, 200], [200, 130], null],
  mount,
});
