/**
 * Drill press: a foot, a column, a table on the column and a head on top with
 * its quill and bit over a block on the table. The pointer's height over the
 * press feeds the quill down into the block, on a spring, and the feed lever
 * swings with it. At rest the quill sits part way down, bright.
 *
 * The pattern: one part following a continuous input (feed).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, clamp, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const REST = 0.25, HZ = 96;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let depth = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-4, -4, 0], [64, 44, 0], [64, -4, 0], [-4, 44, 0], [0, 4, HZ + 18], [60, 36, HZ + 18], [60, 50, HZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r, b) => { const [a, i] = rings(x0, y0, x1, y1, r, b), s = solid(g); put(s, prism(P, front, a, i, z0, z1)); return s; };
  box(-4, -4, 64, 44, 0, 8, 5, 2);
  put(solid(g), prism(P, front, disc(10, 20, 6), disc(10, 20, 4.6), 8, HZ));
  box(14, 4, 56, 36, 44, 49, 3, 1.6);
  box(28, 12, 46, 28, 49, 58, 2, 1.2);
  const quill = solid(g), bit = mk("path", { class: "sil" }, g);
  box(0, 4, 60, 36, HZ, HZ + 18, 6, 2);
  const lever = mk("path", { class: "sil" }, g);
  const sp = spring(REST);
  let last = NaN;
  function draw() {
    const v = sp.x;
    if (v === last) return;
    last = v;
    const qz = HZ - 10 - v * depth / 100 * 26;
    put(quill, prism(P, front, disc(37, 20, 5), disc(37, 20, 3.8), qz, HZ));
    bit.setAttribute("d", poly(hull(ringAt(P, disc(37, 20, 1.2, 8), qz - 14).concat(ringAt(P, disc(37, 20, 1.8, 8), qz)))));
    const a = rad(-35 + v * 85), ey = 38 + 24 * Math.cos(a), ez = HZ + 9 - 24 * Math.sin(a);
    lever.setAttribute("d", poly(hull(ringAt(P, disc(30, 38, 1.5, 8), HZ + 9).concat(ringAt(P, disc(30, ey, 2.4, 8), ez)))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const yT = P(37, 20, HZ)[1], yB = P(37, 20, 54)[1], xs = [P(0, 44, 0)[0] - 10, P(64, 0, 0)[0] + 10];
  let state = "";
  function set(p) {
    let t = REST, on = false;
    if (p && p[0] > xs[0] && p[0] < xs[1] && p[1] > yT - 40 && p[1] < yB + 40) { t = clamp((p[1] - yT) / (yB - yT), 0, 1); on = true; }
    sp.t = t;
    const s = on ? Math.round(t * depth / 100 * 26) + "mm" : "rest";
    if (s !== state) { state = s; read.textContent = s; }
    B.wake();
  }
  quill.sil.classList.add("hi");
  set(null);
  draw();
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { depth = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "drillpress",
  means: "A drill press over a block: the pointer's height feeds the quill and bit down while the feed lever swings.",
  rules: [1, 3, 5, 8],
  range: [30, 100, 100],
  tour: [[209, 102], [190, 140], [209, 168], null],
  mount,
});
