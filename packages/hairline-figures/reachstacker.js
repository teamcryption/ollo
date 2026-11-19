/**
 * Reach stacker: a wheeled chassis with a counterweight and a cab, its long
 * boom laid low over the front, carrying a spreader that grips a container.
 * Over the machine the boom swings up on its pivot on the 700ms ease and
 * lifts the container high; leaving lowers it again, the spreader bright.
 * The slider is how far the boom rises.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, clamp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 6, PV = [-34, 0, 30], BL = 78;
const norm = (v) => { const n = Math.hypot(...v) || 1; return v.map((x) => x / n); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

function beam(P, a, d, len, w, h, r, b) {
  d = norm(d);
  const e1 = Math.abs(d[2]) > 0.99 ? [1, 0, 0] : norm(cross([0, 0, 1], d)), e2 = cross(d, e1);
  const at = (ring, s) => ring.map((q) => { const p = [0, 1, 2].map((j) => a[j] + d[j] * s + e1[j] * q.u + e2[j] * q.v); return P(p[0], p[1], p[2]); });
  const R = rrect(-w / 2, -h / 2, w / 2, h / 2, r, 4), I = rrect(-w / 2 + b, -h / 2 + b, w / 2 - b, h / 2 - b, Math.max(0.3, r - b), 4);
  return { sil: poly(hull(at(R, 0).concat(at(R, len)))), crease: poly(at(I, len)) };
}
const tipOf = (a) => [PV[0] + BL * Math.cos(rad(a)), 0, PV[2] + BL * Math.sin(rad(a))];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value, on = false;
  const C = Cam(45, 0.5, 2.35);
  const pts = [[-46, -20, 0], [36, 20, 0], [-46, 20, 0], [36, -20, 0]];
  for (const a of [REST, 52]) { const t = tipOf(a); pts.push([t[0] + 12, 28, t[2] - 30], [t[0] - 12, -28, t[2] + 6], [t[0] + 12, -28, t[2] + 6], [t[0] - 12, 28, t[2] - 30]); }
  fit(C, pts, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const slab = (s, x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); };
  const wheel = (x, y) => put(solid(g), beam(P, [x, y, 8], [0, y < 0 ? -1 : 1, 0], 6, 15, 15, 7.4, 1.2));
  wheel(-28, -12); wheel(14, -12);
  slab(solid(g), -44, -13, 32, 13, 4, 1.5, 9, 18);
  slab(solid(g), -46, -15, -30, 15, 4, 1.5, 18, 30);
  slab(solid(g), -6, -16, 14, -5, 3, 1.2, 18, 40);
  wheel(-28, 12); wheel(14, 12);
  const box = solid(g), arm = solid(g), spr = solid(g);
  spr.sil.classList.add("hi");

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const t = tipOf(a);
    slab(box, t[0] - 11, -25, t[0] + 11, 25, 2, 1, t[2] - 30, t[2] - 6);
    put(arm, beam(P, PV, [Math.cos(rad(a)), 0, Math.sin(rad(a))], BL + 2, 9, 9, 3, 1));
    slab(spr, t[0] - 4, -28, t[0] + 4, 28, 2, 1, t[2] - 6, t[2] - 1);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const sp = pts.map((p) => P(...p)), X0 = Math.min(...sp.map((p) => p[0])), X1 = Math.max(...sp.map((p) => p[0]));
  const Y0 = Math.min(...sp.map((p) => p[1])), Y1 = Math.max(...sp.map((p) => p[1]));
  const say = () => { read.textContent = "boom " + Math.round(top) + "°"; };
  function move([sx, sy]) {
    if (sx < X0 || sx > X1 || sy < Y0 || sy > Y1) return leave();
    on = true;
    tset(ang, top, performance.now(), 0);
    say();
    B.wake();
  }
  function leave() { on = false; tset(ang, REST, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { top = clamp(v, 26, 52); if (on) { tset(ang, top, performance.now(), 0); say(); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "reachstacker",
  means: "A reach stacker: over it the boom swings up on its pivot and lifts the gripped container high; the slider sets how far.",
  rules: [3, 5, 8],
  range: [26, 40, 52],
  tour: [[259, 205], [212, 280], [134, 138], null],
  mount,
});
