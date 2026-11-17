/**
 * Dial thermostat: a round dial on a square plate on the wall, its cover
 * hinged at one side over the coil. The pointer draws the cover open on a
 * spring, wider the nearer it comes, to show the spiral coil inside; the coil
 * goes bright. At rest the cover sits shut with its setting tab bright.
 * The slider is how far the cover may open.
 */
const {
  Cam, clamp, fit, hull, poly, open, proj, rad, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const R = 30, YC = 0, ZC = 50, X0 = 3, X1 = 7, X2 = 18, YH = R + 2, REST = 4, N = 40;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, -44, 6], [0, 44, 6], [0, -44, 94], [0, 44, 94], [X2 + 2 * R, YH, ZC], [X2, -R, ZC]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // a disc of samples in the wall's plane (y, z), at depth x
  const ring = (r, x, y0 = YC, z0 = ZC, n = N) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    return [x, y0 + r * Math.cos(t), z0 + r * Math.sin(t)];
  });
  const pr = (pts) => pts.map((q) => P(...q));
  const slab = (pts0, pts1) => poly(hull(pr(pts0).concat(pr(pts1))));
  // the back plate: a rounded square standing on the wall
  const sq = (h, x, rr) => {
    const out = [];
    for (const [cy, cz, a0] of [[h - rr, h - rr, 0], [-h + rr, h - rr, 90], [-h + rr, -h + rr, 180], [h - rr, -h + rr, 270]])
      for (let i = 0; i <= 4; i++) { const t = rad(a0 + i * 22.5); out.push([x, YC + cy + rr * Math.cos(t), ZC + cz + rr * Math.sin(t)]); }
    return out;
  };
  mk("path", { class: "sil", d: slab(sq(42, 0, 8), sq(42, X0, 8)) }, g);
  mk("path", { class: "nf lo", d: poly(pr(sq(40, X0, 7))) }, g);
  mk("path", { class: "sil", d: slab(ring(R, X0), ring(R, X1)) }, g);
  // the coil: a spiral on the base's face
  const sp = [];
  for (let i = 0; i <= 120; i++) { const t = (i / 120) * Math.PI * 7, r = 3 + (i / 120) * (R - 8); sp.push([X1, YC + r * Math.cos(t), ZC + r * Math.sin(t)]); }
  const coil = mk("path", { class: "nf", d: open(pr(sp)) }, g);
  const cover = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g), tab = mk("path", { class: "sil" }, g);
  const sw = spring(REST);
  let last = NaN;

  function draw() {
    const a = rad(sw.x);
    if (a === last) return;
    last = a;
    const ca = Math.cos(a), sa = Math.sin(a);
    const T = ([x, y, z]) => { const dx = x - X1, dy = y - YH; return [X1 + dx * ca - dy * sa, YH + dy * ca + dx * sa, z]; };
    const back = ring(R, X1 + 0.4).map(T), fr = ring(R, X2).map(T);
    cover.setAttribute("d", poly(hull(pr(back).concat(pr(fr)))));
    face.setAttribute("d", poly(pr(ring(R - 3, X2).map(T))));
    const tb = [[X2, -4, ZC + R - 2], [X2, 4, ZC + R - 2], [X2, 4, ZC + R + 7], [X2, -4, ZC + R + 7]];
    tab.setAttribute("d", slab(tb.map(T), tb.map((q) => T([q[0] - 5, q[1], q[2]]))));
  }
  const B = register(stage, (dt) => { const m = stepS(sw, dt); draw(); return m; });
  bag.add(B.unregister);

  const mid = P(X2, YC, ZC);
  function setOver(p) {
    let on = false;
    if (p) {
      const d = Math.hypot(p[0] - mid[0], p[1] - mid[1]);
      on = d < 150;
      sw.t = on ? reach * clamp(1.25 - d / 150, 0.45, 1) : REST;
    } else sw.t = REST;
    tab.classList.toggle("hi", !on);
    coil.classList.toggle("hi", on);
    read.textContent = on ? Math.round(sw.t) + "°" : "rest";
    B.wake();
  }
  setOver(null);
  bag.add(pointer(stage, { move: setOver, leave: () => setOver(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "thermostat",
  means: "A round dial thermostat on a wall plate: its cover swings open toward the pointer to show the spiral coil inside.",
  rules: [3, 4, 5, 8],
  range: [40, 75, 100],
  tour: [[227, 181], [160, 235], [275, 120], null],
  mount,
});
