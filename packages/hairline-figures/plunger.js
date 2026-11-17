/**
 * Plunger: a sink plunger standing in a shallow basin over the drain, a
 * rubber cup, a long wooden handle and a grip on top. The pointer is where
 * the handle is pushed: the whole plunger tilts on its cup toward it, bright.
 * At rest it leans a little to the back left. The slider is how far it tilts.
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const H = 74, MAX = 0.62, REST = [-0.16, -0.08];
// a tube from a to b, radius r0 at a and r1 at b: its outline and its far-end ring
function tube(P, a, b, r0, r1, n = 28) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d), w = d.map((q) => q / L);
  let u = [-w[1], w[0], 0]; const lu = Math.hypot(...u) || 1; u = lu < 1e-6 ? [1, 0, 0] : u.map((q) => q / lu);
  const v = [w[1] * u[2] - w[2] * u[1], w[2] * u[0] - w[0] * u[2], w[0] * u[1] - w[1] * u[0]];
  const ring = (c, r) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2, cs = Math.cos(t) * r, sn = Math.sin(t) * r;
    return P(c[0] + u[0] * cs + v[0] * sn, c[1] + u[1] * cs + v[1] * sn, c[2] + u[2] * cs + v[2] * sn);
  });
  const A = ring(a, r0), B = ring(b, r1);
  return { sil: poly(hull(A.concat(B))), top: poly(B) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  const ext = [[-46, -46, 0], [46, 46, 0], [46, -46, 0], [-46, 46, 0], [0, 0, H + 14]];
  fit(C, ext, 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [bo, bi] = rings(-46, -46, 46, 46, 16, 2);
  put(solid(g), prism(P, front, bo, bi, 0, 6));
  place(flatDot(g, C, 2.2, "dot m"), P(14, 22, 6));
  const parts = [solid(g), solid(g), solid(g), solid(g)];
  const tx = spring(REST[0]), ty = spring(REST[1]);
  let max = MAX * value, drawn = "";

  function draw() {
    const ax = tx.x, ay = ty.x, key = ax.toFixed(4) + ay.toFixed(4);
    if (key === drawn) return; drawn = key;
    const up = (h) => [h * Math.sin(ax), h * Math.sin(ay), 6 + h * Math.cos(Math.hypot(ax, ay))];
    const segs = [[0, 3, 17, 15], [3, 12, 11, 4.5], [12, H, 3.2, 3.2], [H, H + 16, 5, 4.4]];
    segs.forEach(([h0, h1, r0, r1], i) => {
      const t = tube(P, up(h0), up(h1), r0, r1);
      parts[i].sil.setAttribute("d", t.sil);
      parts[i].cr.setAttribute("d", i === 2 ? "" : t.top);
    });
  }
  const B = register(stage, (dt) => { const m = stepS(tx, dt) | stepS(ty, dt); draw(); return !!m; });
  bag.add(B.unregister);
  function aim(o) {
    if (!o) { tx.t = REST[0]; ty.t = REST[1]; read.textContent = "rest"; }
    else {
      const r = Math.hypot(o[0], o[1]), k = clamp(r / 50, 0, 1) * max / (r || 1);
      tx.t = o[0] * k; ty.t = o[1] * k;
      read.textContent = Math.round(Math.hypot(tx.t, ty.t) * 57.3) + "°";
    }
    parts[2].sil.classList.add("hi"); parts[3].sil.classList.add("hi");
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); aim(Math.hypot(x, y) > 90 ? null : [x, y]); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { max = MAX * v; }, destroy: bag.dispose };
}

hairline({
  name: "plunger",
  means: "A sink plunger in a basin: it tilts on its rubber cup toward the pointer, the handle bright.",
  rules: [1, 3, 5],
  range: [0.5, 1, 1.3],
  tour: [[70, 208], [200, 257], [330, 208], null],
  mount,
});
