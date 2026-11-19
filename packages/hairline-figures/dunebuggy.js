/**
 * Dune buggy: a low open tub on four fat tyres under a tubular roll cage, the
 * engine bare at the back. The pointer's place across the frame steers the
 * front wheels, swinging them hard left or right on their kingpins. At rest
 * they point a few degrees off straight, bright. The slider is how far they
 * can steer.
 *
 * The pattern: one pair of parts turning about a vertical axis (turn).
 */
const { Cam, clamp, fit, facing, hull, lerp, open, poly, prism, proj, rad, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 124, W = 76, XR = 26, RR = 20, XF = 104, RF = 20, TF = 16, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[0, 0, 0], [L + 6, W + 4, 0], [L + 6, -4, 0], [0, W, 0], [40, 16, 66], [78, W - 16, 66], [XR, 0, 2 * RR], [XR, W, 2 * RR]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const rearRing = (y, r) => {
    const pts = [];
    for (let i = 0; i < 32; i++) { const t = (i / 32) * Math.PI * 2; pts.push(P(XR + r * Math.cos(t), y, RR + r * Math.sin(t))); }
    return pts;
  };
  const rear = (y0, y1, yo) => {
    mk("path", { d: poly(hull(rearRing(y0, RR).concat(rearRing(y1, RR)))) }, g);
    mk("path", { d: poly(rearRing(yo, RR - 7)), class: "nf lo" }, g);
  };
  // a point on a front wheel at (XF, yc) steered by a: d along the rolling direction, n across, z up
  const fp = (yc, a, d, n, z) => P(XF + d * Math.cos(rad(a)) - n * Math.sin(rad(a)), yc + d * Math.sin(rad(a)) + n * Math.cos(rad(a)), z);
  const fRing = (yc, a, n, r) => {
    const pts = [];
    for (let i = 0; i < 32; i++) { const t = (i / 32) * Math.PI * 2; pts.push(fp(yc, a, r * Math.cos(t), n, RF + r * Math.sin(t))); }
    return pts;
  };
  const frontWheel = (yc, side) => ({ yc, side, tyre: mk("path", { class: "sil hi" }, g), hub: mk("path", { class: "nf lo" }, g) });
  rear(0, 18, 0);
  const far = frontWheel(8, -1);
  const [br, bi] = rings(4, 16, L, W - 16, 8, 1.6);
  put(solid(g), prism(P, front, br, bi, 14, 28));
  put(solid(g), prism(P, front, ...rings(6, 22, 30, W - 22, 4, 1.2), 28, 40));
  mk("path", { d: seg(P(46, 24, 28), P(58, 24, 40)) + seg(P(46, W - 24, 28), P(58, W - 24, 40)) + seg(P(84, W / 2, 28), P(80, W / 2 + 6, 40)), class: "nf lo" }, g);
  let cage = "";
  for (const x of [40, 78]) cage += open([P(x, 18, 28), P(x, 18, 66), P(x, W - 18, 66), P(x, W - 18, 28)]);
  for (const y of [18, W - 18]) cage += seg(P(40, y, 66), P(78, y, 66)) + seg(P(78, y, 66), P(106, y, 28)) + seg(P(40, y, 66), P(20, y, 40));
  mk("path", { d: cage, class: "nf" }, g);
  rear(W - 18, W, W);
  const near = frontWheel(W - 8, 1);
  const steer = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    for (const w of [far, near]) {
      w.tyre.setAttribute("d", poly(hull(fRing(w.yc, a, -TF / 2, RF).concat(fRing(w.yc, a, TF / 2, RF)))));
      w.hub.setAttribute("d", poly(fRing(w.yc, a, w.side * TF / 2, RF - 8)));
    }
  }
  const B = register(stage, (dt) => { const m = stepS(steer, dt); draw(steer.x); return m; });
  bag.add(B.unregister);
  function aim(a, r) { steer.t = a; read.textContent = r ? "rest" : (a < 0 ? "L" : "R") + Math.abs(Math.round(a)) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(lerp(-max, max * 0.5, clamp((sx - 90) / 220, 0, 1))), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "dunebuggy",
  means: "A dune buggy under a tubular roll cage: the pointer steers its front wheels, swinging them hard left or right on their kingpins.",
  rules: [1, 3, 5, 6],
  range: [24, 38, 45],
  tour: [[97, 129], [332, 211], [204, 187], null],
  mount,
});
