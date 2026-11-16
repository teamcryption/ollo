const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, run, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;
const V = [0.612, 0.612, 0.5], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => { const l = Math.hypot(...a) || 1; return a.map((x) => x / l); };
const at = (c, d, s) => [0, 1, 2].map((j) => c[j] + d[j] * s);
function ring3(c, d, r) {
  const u = nrm(crs(d, Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1])), v = crs(u, d);
  return Array.from({ length: 28 }, (_, i) => {
    const t = (i / 28) * Math.PI * 2, n = [0, 1, 2].map((j) => Math.cos(t) * u[j] + Math.sin(t) * v[j]);
    return { p: at(c, n, r), n };
  });
}
const tube = (P, c, d, len, r0, r1) => poly(hull(ring3(c, d, r0).concat(ring3(at(c, d, len), d, r1)).map((q) => P(...q.p))));
const cap = (P, c, d, r) => (dot(d, V) > 0 ? poly(ring3(c, d, r).map((q) => P(...q.p))) : "");
const arc = (P, c, d, r) => open(run(ring3(c, d, r), (q) => dot(q.n, V) > 0).map((q) => P(...q.p)));

/** Rain stick: a long banded tube balanced on a post; the end nearest the pointer dips. */
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-72, -10, 0], [72, 10, 0], [-60, 0, 90], [60, 0, 90], [-20, 20, 0], [20, -20, 0]], 200, 160);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [br, bi] = rings(-18, -18, 18, 18, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  put(solid(g), prism(P, front, circ(3, 20), circ(2, 20), 5, 46));
  const stick = mk("path", { class: "sil hi" }, g), bands = mk("path", { class: "nf" }, g);
  const th = spring(14, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = "";
  const O = [0, 0, 50], L = 74, Rr = 7;
  function draw() {
    const key = th.x.toFixed(2); if (key === last) return; last = key;
    const a = (th.x * Math.PI) / 180, d = [Math.cos(a), 0, Math.sin(a)], s0 = at(O, d, -L);
    stick.setAttribute("d", tube(P, s0, d, 2 * L, Rr, Rr));
    let b = cap(P, at(O, d, L), d, Rr) + cap(P, s0, d.map((x) => -x), Rr);
    for (const s of [-54, -36, -18, 0, 18, 36, 54]) b += arc(P, at(O, d, s), d, Rr);
    bands.setAttribute("d", b);
  }
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);
  const tilt = (t) => { th.t = t; read.textContent = t === 14 ? "rest" : Math.round(t) + "°"; B.wake(); };
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.abs(y) > 90 || Math.abs(x) > 110) return tilt(14);
      tilt(-clamp(x * 0.5, -34, 34));
    },
    leave: () => tilt(14),
  }));
  bag.add(() => svg.replaceChildren());
  tilt(14);
  return { set: (v) => { th.k = 100 * v; th.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "didgeridoo",
  means: "A rain stick balanced on a post: the end nearest the pointer dips and the tube tilts.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[274, 271], [126, 197], [200, 230], null],
  mount,
});
