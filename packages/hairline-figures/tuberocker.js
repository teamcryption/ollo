/**
 * Tube rocker: a low motor base with a ribbed platform on a pivot, five
 * capped sample tubes lying across it. The pointer's side of the platform
 * tips down and the tubes rock with it; leaving settles it to a slight lean.
 * The slider is the rocking angle.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, clamp, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 110, D = 70, ZC = 30, REST = -5;
const rot = (p, a) => { const dx = p[0] - L / 2, dz = p[2] - ZC, ca = Math.cos(a), sa = Math.sin(a); return [L / 2 + dx * ca - dz * sa, p[1], ZC + dx * sa + dz * ca]; };
function tube(x0, x1, y, z, r, n = 18) {
  const pts = [];
  for (const x of [x0, x1]) for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; pts.push([x, y + r * Math.cos(t), z + r * Math.sin(t)]); }
  return pts;
}
const box = (x0, x1, y0, y1, z0, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]); return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.95);
  const plate = box(0, L, 0, D, ZC, ZC + 3);
  const tubes = [10, 22, 34, 46, 58].map((y, k) => ({ body: tube(12, 92, y, ZC + 8, 4.6), cap: tube(92, 102, y, ZC + 8, 5.6), k }));
  const all = plate.concat(...tubes.map((t) => t.body.concat(t.cap)));
  fit(C, [[22, 14, 0], [88, 56, 0]].concat(all.map((p) => rot(p, rad(26))), all.map((p) => rot(p, rad(-26)))), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(22, 14, 88, 56, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, 18));
  const [pr, pi] = rings(48, 30, 62, 40, 3, 1);
  put(solid(g), prism(P, front, pr, pi, 18, ZC));
  const led = mk("circle", { r: 2.4, class: "dot off" }, g);
  const lp = P(70, 56, 9); led.setAttribute("cx", lp[0]); led.setAttribute("cy", lp[1]);
  const pl = solid(g);
  pl.sil.classList.add("hi");
  const tg = tubes.map((t) => ({ ...t, b: solid(g), c: solid(g) }));
  const sp = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), q = (p) => P(...rot(p, a));
    pl.sil.setAttribute("d", poly(hull(plate.map(q))));
    let cr = seg(q([0, D, ZC + 3]), q([L, D, ZC + 3])) + seg(q([L, 0, ZC + 3]), q([L, D, ZC + 3]));
    for (const y of [16, 28, 40, 52]) cr += seg(q([4, y, ZC + 3]), q([L - 4, y, ZC + 3]));
    pl.cr.setAttribute("d", cr);
    for (const t of tg) {
      t.b.sil.setAttribute("d", poly(hull(t.body.map(q))));
      t.c.sil.setAttribute("d", poly(hull(t.cap.map(q))));
      t.b.cr.setAttribute("d", seg(q(t.body[3]), q(t.body[21])));
    }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const rest = all.map((p) => P(...rot(p, rad(REST)))).concat([[22, 14, 0], [88, 56, 0]].map((p) => P(...p)));
  const xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const bx = [Math.min(...xs) - 6, Math.max(...xs) + 6, Math.min(...ys) - 6, Math.max(...ys) + 6];
  const cx = (bx[0] + bx[1]) / 2, hw = (bx[1] - bx[0]) / 2;
  let px = null;
  function aim() {
    if (px === null) { sp.t = REST; read.textContent = "rest"; }
    else { const s = clamp((px - cx) / (hw * 0.7), -1, 1); sp.t = -s * max; read.textContent = (s < 0 ? "L " : "R ") + Math.round(Math.abs(s * max)) + "°"; }
    B.wake();
  }
  aim();
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { px = sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3] ? sx : null; aim(); },
    leave: () => { px = null; aim(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; aim(); }, destroy: bag.dispose };
}

hairline({
  name: "tuberocker",
  means: "A lab tube rocker: its platform of capped tubes tips toward the side under the pointer and settles to a lean on leaving.",
  rules: [1, 3, 5, 8],
  range: [8, 20, 26],
  tour: [[299, 169], [160, 140], [228, 200], null],
  mount,
});
