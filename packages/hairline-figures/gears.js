/**
 * Gears: a train of five meshing spur gears of different sizes on a base
 * plate, each on its axle boss. The pointer's angle around the big gear is
 * where the train turns to: the big gear follows it on a spring and every
 * other gear turns by its ratio, so the small ones spin fast. The gear under
 * the pointer is bright. At rest the train sits part turned, the big gear
 * bright. The slider is the spring's stiffness.
 *
 * The pattern: a continuous aim (one spring, an angle); the hit is on the
 * plate's plane, which never moves, against the gears' fixed centres.
 */
const {
  Cam, circ, facing, fit, open, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

// teeth, parent, direction from parent (deg); pitch radius = teeth
const SPEC = [[24, -1, 0], [12, 0, -20], [16, 1, 70], [10, 0, 135], [14, 3, 200]];
const Z0 = 4, Z1 = 7, REST = 0.35, FAV = 0;
const gears = [];
for (const [n, par, dir] of SPEC) {
  let cx = 0, cy = 0;
  const th = dir * Math.PI / 180;
  if (par >= 0) { const p = gears[par], d = p.n + n + 0.4; cx = p.cx + d * Math.cos(th); cy = p.cy + d * Math.sin(th); }
  gears.push({ n, par, th, cx, cy, k: gears.length });
}
function phases(a0) {
  const out = [a0];
  for (const g of gears.slice(1)) {
    const p = gears[g.par], pa = out[g.par], r = p.n / g.n;
    out.push(g.th + Math.PI - Math.PI / g.n - r * (pa - g.th));
  }
  return out;
}
function profile(g, a) {
  const pts = [], p = (2 * Math.PI) / g.n, R0 = g.n - 2, R1 = g.n + 1.8;
  for (let i = 0; i < g.n; i++) {
    const b = a + i * p;
    for (const [f, R] of [[-0.27, R0], [-0.13, R1], [0.13, R1], [0.27, R0]]) pts.push([g.cx + R * Math.cos(b + f * p), g.cy + R * Math.sin(b + f * p)]);
  }
  return pts;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const g of gears) { x0 = Math.min(x0, g.cx - g.n - 6); y0 = Math.min(y0, g.cy - g.n - 6); x1 = Math.max(x1, g.cx + g.n + 6); y1 = Math.max(y1, g.cy + g.n + 6); }
  fit(C, [[x0, y0, 0], [x1, y1, 0], [x0, y1, 0], [x1, y0, 0], [x0, y0, Z1], [x1, y1, Z1]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(x0, y0, x1, y1, 6, 1.6);
  put(solid(g), prism(P, front, pr, pi, 0, 3));
  const shift = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

  const order = gears.slice().sort((a, b) => a.cx + a.cy - (b.cx + b.cy));
  for (const gr of order) {
    const grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, shift(circ(4, 24), gr.cx, gr.cy), null, 3, Z0));
    gr.under = mk("path", { class: "lo" }, grp);
    gr.top = mk("path", { class: "sil" }, grp);
    gr.hub = mk("path", { class: "nf lo", d: open(shift(circ(Math.max(4, gr.n * 0.45), 32), gr.cx, gr.cy).map((q) => P(q.u, q.v, Z1)).concat([P(gr.cx + Math.max(4, gr.n * 0.45), gr.cy, Z1)])) }, grp);
    place(flatDot(grp, C, 1.2, "dot m"), P(gr.cx, gr.cy, Z1));
  }

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    const ph = phases(sp.x);
    for (const gr of gears) {
      const pts = profile(gr, ph[gr.k]);
      gr.under.setAttribute("d", poly(pts.map(([x, y]) => P(x, y, Z0))));
      gr.top.setAttribute("d", poly(pts.map(([x, y]) => P(x, y, Z1))));
    }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function setPointer(w) {
    let on = -1;
    if (w) {
      const a = Math.atan2(w[1], w[0]);
      sp.t = sp.t + (a - sp.t) - 2 * Math.PI * Math.round((a - sp.t) / (2 * Math.PI));
      for (const gr of gears) if (Math.hypot(w[0] - gr.cx, w[1] - gr.cy) < gr.n + 2) on = gr.k;
    } else sp.t = REST + 2 * Math.PI * Math.round((sp.t - REST) / (2 * Math.PI));
    for (const gr of gears) gr.top.classList.toggle("hi", gr.k === (w ? on : FAV));
    read.textContent = !w ? "rest" : on < 0 ? "turn" : "gear " + (on + 1);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const w = unproj(C, p[0], p[1], Z1);
      setPointer(w[0] < x0 - 12 || w[0] > x1 + 12 || w[1] < y0 - 12 || w[1] > y1 + 12 ? null : w);
    },
    leave: () => setPointer(null),
  }));
  bag.add(() => svg.replaceChildren());
  setPointer(null);
  draw();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "gears",
  means: "Five meshing spur gears on a plate: the train turns with the pointer's angle round the big gear, each gear by its ratio.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[200, 120], [260, 200], [150, 210], null],
  mount,
});
