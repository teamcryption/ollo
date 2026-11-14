/**
 * Pet water fountain: a round bowl with a column and a top dish, water
 * arcing from the dish's lip down into the bowl. The nearer the pointer
 * comes to the fountain, the higher and farther the stream throws, and the
 * ripple where it lands widens. At rest a low trickle runs, bright.
 *
 * The pattern: one value from the pointer's distance (spring).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, ringAt, clamp, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 40, BH = 12, WZ = 9, TZ = 34, TR = 16, REST = 0.25;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, 0, TZ + 22]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(R), disc(R - 2.4), 0, BH));
  mk("path", { d: poly(ringAt(P, disc(R - 4), WZ)), class: "lo" }, g);
  const ripple = mk("path", { class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(9, 24), disc(7.4, 24), WZ, TZ));
  put(solid(g), prism(P, front, disc(TR, 32), disc(TR - 2, 32), TZ, TZ + 4));
  mk("path", { d: poly(hull(ringAt(P, disc(3.5, 16), TZ + 4).concat(ringAt(P, disc(2.4, 16), TZ + 7)))), class: "nf" }, g);
  const stream = mk("path", { class: "nf hi" }, g);
  const s2 = mk("path", { class: "nf hi" }, g);

  const f = spring(REST);
  let last = NaN;
  const D = Math.SQRT1_2;
  function draw(v) {
    if (Math.abs(v - last) < 1e-4) return;
    last = v;
    const r0 = TR, r1 = Math.min(TR + 4 + 20 * v, R - 6), h = 1 + 18 * v, z0 = TZ + 3, pts = [], pts2 = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20, r = r0 + (r1 - r0) * t, z = z0 + (WZ - z0) * t * t + h * 4 * t * (1 - t) * (1 - t * 0.4);
      pts.push(P(r * D, r * D, z));
      pts2.push(P(r * D + 2.2, r * D - 2.2, z - 1.6));
    }
    stream.setAttribute("d", open(pts));
    s2.setAttribute("d", open(pts2));
    ripple.setAttribute("d", poly(ringAt(P, circ(2 + 6 * v, 24).map((q) => ({ ...q, u: q.u + r1 * D, v: q.v + r1 * D })), WZ)));
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(f, dt); draw(f.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0), d = Math.hypot(x, y);
    const v = clamp(1 - (d - R) / (reach * 1.0), 0.12, 1);
    f.t = v;
    read.textContent = "flow " + Math.round(v * 100);
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { f.t = REST; read.textContent = "rest"; B.wake(); } }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "feedingstation",
  means: "A pet water fountain: the nearer the pointer comes, the higher and farther the stream arcs into the bowl.",
  rules: [3, 5, 8],
  range: [80, 140, 200],
  tour: [[200, 160], [130, 200], [280, 120], null],
  mount,
});
