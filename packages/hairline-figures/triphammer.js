/**
 * Trip hammer: a long helve pivoted on a post, a heavy head over the anvil at
 * its front and a water wheel at its tail. The pointer along the hammer trips
 * the helve: the head swings up off the anvil and the wheel turns with it.
 * At rest the head hangs just lifted, bright. The slider is how high it swings.
 */
const { Cam, clamp, facing, fit, hull, poly, open, prism, proj, rings, unproj, spring, stepS, disposer, mk, pointer, put, register, solid, rad } = HL;

const PV = [0, 0, 32], REST = 2, WC = [-40, -18, 24], WR = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, cur = -1;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-60, -24, 0], [70, 14, 0], [-40, -18, 42], [-58, -18, 24], [64, 0, 70], [70, -9, 0], [-36, 6, 12]], 200, 168);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const base = solid(g);
  const [br, bi] = rings(-60, -24, 70, 14, 5, 1.6);
  put(base, prism(P, front, br, bi, 0, 4));
  const wheel = mk("g", {}, g);
  const wsil = mk("path", { class: "sil" }, wheel), wcr = mk("path", { class: "nf lo" }, wheel), spokes = mk("path", { class: "nf lo" }, wheel);
  const post = solid(g);
  const [pr, pi] = rings(-5, -5, 5, 5, 2, 1);
  put(post, prism(P, front, pr, pi, 4, 30));
  const helve = mk("path", { class: "sil hi" }, g);
  const anvil = solid(g);
  const [ar, ai] = rings(46, -9, 66, 9, 2.4, 1.2);
  put(anvil, prism(P, front, ar, ai, 4, 15));
  const head = mk("path", { class: "sil hi" }, g);
  function rot(a) {
    const c = Math.cos(a), s = Math.sin(a);
    return ([x, y, z]) => P(PV[0] + x * c - z * s, y, PV[2] + x * s + z * c);
  }
  function boxPts(T, x0, x1, y0, y1, z0, z1) {
    const o = [];
    for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push(T([x, y, z]));
    return o;
  }
  function disc(y, r, w) {
    const o = [];
    for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2 + w; o.push(P(WC[0] + r * Math.cos(t), y, WC[2] + r * Math.sin(t))); }
    return o;
  }
  const ang = spring(REST);
  let last = NaN;
  function draw() {
    const a = ang.x;
    if (a === last) return;
    last = a;
    const T = rot(rad(a));
    helve.setAttribute("d", poly(hull(boxPts(T, -36, 60, -3, 3, -2, 2.5))));
    head.setAttribute("d", poly(hull(boxPts(T, 49, 62, -6, 6, -15, 4))));
    const w = rad(a * 6);
    wsil.setAttribute("d", poly(hull(disc(WC[1] - 4, WR, 0).concat(disc(WC[1], WR, 0)))));
    wcr.setAttribute("d", poly(disc(WC[1], WR - 3, 0)));
    let d = "";
    for (let i = 0; i < 6; i++) {
      const t = w + (i * Math.PI) / 3, p = P(WC[0] + WR * Math.cos(t), WC[1], WC[2] + WR * Math.sin(t));
      const q = P(WC[0] + (WR + 4) * Math.cos(t), WC[1] - 2, WC[2] + (WR + 4) * Math.sin(t));
      d += open([P(WC[0], WC[1], WC[2]), p]) + open([p, q]);
    }
    spokes.setAttribute("d", d);
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 24);
    if (x < -70 || x > 80 || y < -45 || y > 40) return -1;
    return clamp((x + 40) / 100, 0, 1);
  }
  function set(v) {
    cur = v;
    ang.t = v < 0 ? REST : REST + 30 * reach * v;
    read.textContent = v < 0 ? "rest" : Math.round(ang.t) + "°";
    B.wake();
  }
  set(-1);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (cur >= 0) set(cur); }, destroy: bag.dispose };
}

hairline({
  name: "triphammer",
  means: "A trip hammer: the pointer along it trips the helve, swinging the head up off the anvil as the water wheel turns.",
  rules: [1, 3, 5, 6],
  range: [0.3, 1, 1],
  tour: [[217, 146], [247, 161], [265, 170], null],
  mount,
});
