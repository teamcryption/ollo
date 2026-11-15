/**
 * Car GPS: a navigation screen on a suction-cup arm, stuck to a slab of
 * dashboard. The screen carries a dim route and a bright position dot. The
 * pointer is the driver: the screen swivels on its ball joint to face it,
 * on a spring, clamped so its face never turns away. At rest it sits a little
 * askew toward the passenger. The slider is how stiff the joint is.
 *
 * The pattern: a continuous aim on one angle; the hit is the dashboard's
 * plane, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, unproj, hull, fillet, poly, open, seg,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid, clamp,
} = HL;

const W = 25, H = 15, TH = 5, ZC = 32, VIEW = Math.PI / 4, SPAN = 1.25;
const REST = VIEW - 0.5, CUP = [-12, -12];
const ROUTE = [[-18, -9], [-8, -9], [-3, -2], [8, -2], [12, 6]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.0);
  const frame = (a, u, d, v) => {
    const nx = Math.cos(a), ny = Math.sin(a);
    return [-ny * u + nx * d, nx * u + ny * d, ZC + v];
  };
  const ext = [[-36, -30, 0], [36, 30, 0]];
  for (const a of [VIEW - SPAN, VIEW, VIEW + SPAN]) for (const u of [-W, W]) for (const v of [-H, H]) ext.push(frame(a, u, -TH, v), frame(a, u, 0, v));
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-34, -28, 34, 28, 7, 1.6), 0, 4));
  const at = (r) => r.map((q) => ({ ...q, u: q.u + CUP[0], v: q.v + CUP[1] }));
  put(solid(g), prism(P, front, at(circ(8, 40)), at(circ(6.8, 40)), 4, 6.5));
  put(solid(g), prism(P, front, at(circ(2.4, 20)), null, 6.5, 14));
  const arm = mk("path", { class: "nf sil" }, g);
  const scr = solid(g);
  const disp = mk("path", { class: "nf lo" }, g);
  const route = mk("path", { class: "nf lo" }, g);
  const pos = mk("circle", { class: "dot", r: 2.2 }, g);

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const Q = (u, d, v) => P(...frame(a, u, d, v));
    const pts = [];
    for (const u of [-W, W]) for (const d of [-TH, 0]) for (const v of [-H, H]) pts.push(Q(u, d, v));
    const h = hull(pts);
    scr.sil.setAttribute("d", poly(fillet(h, h.map(() => 3))));
    scr.cr.setAttribute("d", open([Q(-W + 1, 0, H - 1), Q(W - 1, 0, H - 1)]));
    const box = [[-W + 3, -H + 3], [W - 3, -H + 3], [W - 3, H - 3], [-W + 3, H - 3]].map(([u, v]) => Q(u, 0.2, v));
    disp.setAttribute("d", poly(fillet(box, [1.5, 1.5, 1.5, 1.5])));
    route.setAttribute("d", open(ROUTE.map(([u, v]) => Q(u, 0.2, v))));
    place(pos, Q(12, 0.2, 6));
    const b = frame(a, 0, -TH, 0);
    arm.setAttribute("d", seg(P(CUP[0], CUP[1], 14), P(CUP[0], CUP[1], 22)) + seg(P(CUP[0], CUP[1], 22), P(...b)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; B.wake(); return; }
    const t = clamp(Math.atan2(p[1], p[0]), VIEW - SPAN, VIEW + SPAN);
    sp.t = t;
    read.textContent = Math.round(((t - VIEW) * 180) / Math.PI) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], ZC);
      if (Math.hypot(x, y) < 6 || Math.hypot(x, y) > 90) return aim(null);
      aim([x, y]);
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  draw();
  scr.sil.classList.add("hi");
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "gpsunit",
  means: "A car GPS on a suction-cup arm: the screen swivels on its ball joint to face the pointer, and springs back askew.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[338, 144], [200, 213], [62, 144], null],
  mount,
});
