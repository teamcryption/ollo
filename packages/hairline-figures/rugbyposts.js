/**
 * Rugby posts: two tall uprights in padded feet, a crossbar between them, and
 * a ball on its tee on the field in front. The pointer stands somewhere on the
 * goal's face and the ball flies there on a spring: between the uprights and
 * over the bar it scores. At rest the ball sits on the tee, bright. The slider
 * is the bar's height.
 *
 * The pattern: one part following the pointer through a plane (aim).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 22, PH = 92, TEE = [0, 62, 9];
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let bar = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-56, -20, 0], [56, 84, 0], [-56, 84, 0], [56, -20, 0], [0, 0, PH + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-56, -20, 56, 84, 8, 2);
  put(solid(g), prism(P, front, fr, fi, -2, 0));
  mk("path", { d: poly([P(-50, 0, 0), P(50, 0, 0)]), class: "dash nf" }, g);
  const post = (x) => {
    put(solid(g), prism(P, front, disc(x, 0, 6), disc(x, 0, 4.5), 0, 16));
    put(solid(g), prism(P, front, disc(x, 0, 2.4, 14), disc(x, 0, 1.6, 14), 16, PH));
  };
  post(-PX);
  const barEl = mk("path", { class: "sil" }, g);
  post(PX);
  // the tee
  put(solid(g), prism(P, front, disc(TEE[0], TEE[1], 3.5, 14), disc(TEE[0], TEE[1], 2.5, 14), 0, 2.5));
  const ball = mk("path", { class: "sil hi" }, g), seam = mk("path", { class: "nf lo" }, g);

  // the goal's face, y = 8: screen to (x, z) through the inverse of P there
  const o = P(0, 8, 0), ex = P(1, 8, 0), ez = P(0, 8, 1);
  const a = ex[0] - o[0], b = ez[0] - o[0], c = ex[1] - o[1], d = ez[1] - o[1], det = a * d - b * c;
  const onFace = ([sx, sy]) => { const u = sx - o[0], v = sy - o[1]; return [(d * u - b * v) / det, (a * v - c * u) / det]; };

  const bx = spring(TEE[0]), by = spring(TEE[1]), bz = spring(TEE[2]);
  let last = "", lastBar = NaN;
  function draw() {
    if (bar !== lastBar) { lastBar = bar; const e = (x) => { const q = []; for (let i = 0; i < 16; i++) { const t = (i / 16) * 2 * Math.PI; q.push(P(x, 1.8 * Math.cos(t), bar + 1.8 * Math.sin(t))); } return q; }; barEl.setAttribute("d", poly(hull(e(-PX).concat(e(PX))))); }
    const key = bx.x.toFixed(2) + by.x.toFixed(2) + bz.x.toFixed(2);
    if (key === last) return;
    last = key;
    const pts = [], sm = [];
    for (let i = 0; i <= 8; i++) for (let j = 0; j < 16; j++) {
      const t = (i / 8) * Math.PI, f = (j / 16) * 2 * Math.PI;
      pts.push(P(bx.x + 12 * Math.cos(t), by.x + 7.5 * Math.sin(t) * Math.cos(f), bz.x + 7.5 * Math.sin(t) * Math.sin(f)));
    }
    for (let i = 0; i <= 8; i++) { const t = (i / 8) * Math.PI; sm.push(P(bx.x + 12 * Math.cos(t), by.x + 7.5 * Math.sin(t) * 0.7, bz.x + 7.5 * Math.sin(t) * 0.7)); }
    ball.setAttribute("d", poly(hull(pts)));
    seam.setAttribute("d", "M" + sm.map((p) => p.join(",")).join("L"));
  }
  const B = register(stage, (dt) => {
    const m = [stepS(bx, dt), stepS(by, dt), stepS(bz, dt)].some(Boolean);
    draw();
    return m;
  });
  bag.add(B.unregister);

  function kick(p) {
    if (!p) { bx.t = TEE[0]; by.t = TEE[1]; bz.t = TEE[2]; read.textContent = "rest"; B.wake(); return; }
    const [x, z] = onFace(p), tx = clamp(x, -44, 44), tz = clamp(z, 8, PH);
    bx.t = tx; by.t = 8; bz.t = tz;
    read.textContent = Math.abs(tx) < PX - 3 && tz > bar + 6 ? "over" : Math.abs(tx) >= PX - 3 ? "wide" : "short";
    B.wake();
  }
  read.textContent = "rest";
  draw();
  bag.add(pointer(stage, { move: kick, leave: () => kick(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { bar = v; last = ""; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "rugbyposts",
  means: "Rugby posts with a ball on its tee: the ball flies to where the pointer stands on the goal's face, over the bar or wide.",
  rules: [1, 3, 5, 8],
  range: [24, 34, 48],
  tour: [[230, 109], [284, 91], [175, 158], null],
  mount,
});
