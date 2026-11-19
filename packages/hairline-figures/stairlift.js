/**
 * Stairlift: a flight of six steps against a wall, a rail running up along
 * the wall side and a chair on its carriage with arms and a footplate. The
 * pointer sends the chair up the rail; the slider is how far it climbs. At
 * rest it waits near the foot of the stairs, its back bright.
 *
 * The pattern: one part answering the pointer (lid).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, RUN = 14, RISE = 11, W = 34, SL = RISE / RUN, X0 = 72, TRAVEL = 52;
const zb = (x) => 2 * RISE + (N * RUN + 10 - x) * SL + 2;
// chair parts at the rest station, as [x0, y0, x1, y1, r, z0, z1] around x = 0, z = 0
const PARTS = [
  [-8, 10, 8, 28, 2, -14, -12],
  [-8, -8, 8, 1, 3, -2, 14],
  [-11, 1, 11, 6, 3, 4, 30],
  [-11, 4, 11, 26, 4, 0, 5],
  [-11, 6, -8, 22, 1.4, 13, 16],
  [8, 6, 11, 22, 1.4, 13, 16],
];
const disc = (x, y, r) => circ(r, 12).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.0);
  const ext = [[0, -8, 0], [N * RUN + 8, W, 0], [N * RUN + 8, -8, 0], [0, W, N * RISE]];
  for (const d of [0, TRAVEL]) for (const p of PARTS) ext.push([X0 - d + p[0], p[1], zb(X0) + d * SL + p[6]], [X0 - d + p[2], p[3], zb(X0) + d * SL + p[5]]);
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (let k = N - 1; k >= 0; k--) {
    const x1 = N * RUN - k * RUN, [r, i] = rings(0, 0, x1, W, 2.5, 1.2);
    put(solid(g), prism(P, front, r, i, 0, RISE * (k + 1)));
  }
  const rz = (x) => zb(x) + 4;
  const r0 = N * RUN + 8, r1 = -2;
  mk("path", { d: poly(hull(ringAt(P, disc(r0, -4, 2.2), rz(r0)).concat(ringAt(P, disc(r1, -4, 2.2), rz(r1))))) }, g);
  const chair = mk("g", {}, g);
  const sols = PARTS.map(() => solid(chair));
  sols[2].sil.classList.add("hi");
  const tw = tween(0.1);
  function draw(t) {
    const d = TRAVEL * t, cx = X0 - d, z = zb(X0) + d * SL;
    PARTS.forEach((p, k) => {
      const b = Math.min(1, (Math.min(p[2] - p[0], p[3] - p[1]) / 2) - 0.3);
      const [r, i] = rings(cx + p[0], p[1], cx + p[2], p[3], p[4], b);
      put(sols[k], prism(P, front, r, i, z + p[5], z + p[6]));
    });
  }
  let last = NaN;
  const B = register(stage, (_dt, now) => {
    const v = tval(tw, now);
    if (v !== last) { last = v; draw(v); }
    return !tdone(tw, now);
  });
  bag.add(B.unregister);

  const pts = ext.map((w) => P(...w));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const hit = ([sx, sy]) => (sx < bx[0] - 6 || sx > bx[1] + 6 || sy < bx[2] - 6 || sy > bx[3] + 6 ? -1 : 0);
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tw, a < 0 ? 0.1 : amp, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "up " + Math.round(100 * amp) + "%";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "stairlift",
  means: "A stairlift chair on a rail beside a flight of steps: the pointer sends it climbing up the stairs on its carriage.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[249, 167], [160, 230], [230, 110], null],
  mount,
});
