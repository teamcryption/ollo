/**
 * Ball valve: a short run of pipe through a valve body, hex nuts either side,
 * a stem on top and a long flat lever. The pointer is where the lever is
 * swung: in line with the pipe it is open, across the pipe it is shut. The
 * lever is bright; at rest it sits a little off open. The slider is how
 * quickly it follows (a stiffer or softer spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 14, PR = 7, TOP = 30, REST = 0.42;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
// a pipe along x, from x0 to x1, radius r at height z
function pipe(P, x0, x1, r, z, n = 6) {
  const pts = [];
  for (const x of [x0, x1]) for (let i = 0; i < 32; i++) { const t = (i / 32) * Math.PI * 2; pts.push(P(x, r * Math.cos(t), z + r * Math.sin(t))); }
  const end = Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(x1, r * Math.cos(t), z + r * Math.sin(t)); });
  return { sil: poly(hull(pts)), crease: n === 6 ? poly(end) : "" };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.1);
  const ext = [[-50, -12, 0], [50, 12, 0], [0, 0, TOP + 8], [62, 0, TOP + 6], [0, 62, TOP + 6], [-8, -8, TOP + 6]];
  fit(C, ext, 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const lay = (d) => put(solid(g), d);
  lay(pipe(P, -50, -20, PR, PZ, 32));
  lay(pipe(P, -26, -16, PR + 3.5, PZ));
  const [bo, bi] = rings(-16, -12, 16, 12, 6, 1.4);
  lay(prism(P, front, bo, bi, 1, 27));
  lay(prism(P, front, circ(4, 24), null, 27, TOP));
  lay(pipe(P, 16, 26, PR + 3.5, PZ));
  lay(pipe(P, 20, 50, PR, PZ, 32));
  const [lo, li] = rings(-6, -4.5, 58, 4.5, 4.5, 1.2);
  const lever = solid(g), boss = solid(g);
  lever.sil.classList.add("hi");
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return; drawn = sp.x;
    put(lever, prism(P, front, turn(lo, sp.x), turn(li, sp.x), TOP, TOP + 3.5));
    put(boss, prism(P, front, circ(5.5, 24), null, TOP + 3.5, TOP + 5.5));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(o) {
    sp.t = o ? clamp(Math.atan2(o[1], o[0]), 0, Math.PI / 2) : REST;
    read.textContent = o ? Math.round(100 * Math.cos(sp.t)) + "% open" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); aim(Math.hypot(x, y) > 110 ? null : [x, y]); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "ballvalve",
  means: "A ball valve on a pipe: its lever swings toward the pointer, open in line with the pipe, shut across it.",
  rules: [1, 3, 5],
  range: [0.5, 1, 1.6],
  tour: [[321, 259], [200, 290], [90, 265], null],
  mount,
});
