/**
 * Coal tender: a low railway tender on its frame and wheels, a long hatch over
 * its coal. The pointer over the figure swings the hatch up on its far hinge
 * to show the coal heaped inside. At rest the hatch sits a little ajar,
 * bright. The slider is how far it opens.
 */
const { Cam, fit, hull, poly, proj, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const rbox = (x0, y0, z0, x1, y1, z1, r, zs = [z0, z1]) => { const a = []; for (const [cx, cy, s] of [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, 1], [x0 + r, y0 + r, 2], [x1 - r, y0 + r, 3]]) for (let i = 0; i <= 4; i++) { const t = (s + i / 4) * Math.PI / 2; for (const z of zs) a.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z]); } return a; };
const wheel = (x, r, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; o.push([x + r * Math.cos(t), 41, 10 + r * Math.sin(t)]); } return o; };
const L = 92, Wd = 40, ZT = 42, HY = 2;
function lid(phi) { // a thin hatch hinged along x at y = HY, z = ZT
  const c = Math.cos(phi), s = Math.sin(phi);
  return rbox(6, 0, 0, L - 6, Wd - 6, 2.2, 3).map(([x, dy, dz]) => [x, HY + dy * c - dz * s, ZT + dy * s + dz * c]);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.15);
  const R0 = (7 * Math.PI) / 180;
  fit(C, [...rbox(-4, 0, 0, L + 4, Wd, ZT, 6), ...lid((80 * Math.PI) / 180), ...wheel(16, 9)], 200, 160);
  const P = proj(C), pp = (pts) => pts.map((p) => P(...p));
  const g = mk("g", {}, svg);
  mk("path", { class: "sil", d: poly(hull(pp(rbox(-4, 3, 6, L + 4, Wd - 3, 14, 3)))) }, g);
  mk("path", { class: "sil", d: poly(hull(pp(rbox(0, 0, 14, L, Wd, ZT, 6)))) }, g);
  mk("path", { class: "nf lo", d: poly(pp(rbox(2, 2, ZT, L - 2, Wd - 2, ZT, 4, [ZT]))) }, g);
  for (const x of [16, 36, 56, 76]) { mk("path", { class: "sil", d: poly(pp(wheel(x, 9))) }, g); mk("path", { class: "dot off", d: poly(pp(wheel(x, 2, 10))) }, g); }
  const heapPts = [];
  for (const [r, z] of [[1, 0], [0.75, 4], [0.45, 7.5], [0.15, 9]]) heapPts.push(...rbox(8 + 30 * (1 - r), 6 + 12 * (1 - r), ZT, L - 8 - 30 * (1 - r), Wd - 6 - 12 * (1 - r), ZT, 6 * r + 1, [ZT + z]));
  const heap = mk("path", { class: "nf lo", d: poly(hull(pp(heapPts))) }, g);
  const hatch = mk("path", { class: "sil hi" }, g), hcr = mk("path", { class: "nf lo" }, g);
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const phi = R0 + (t * (amt * Math.PI / 180 - R0)), lp = lid(phi);
    hatch.setAttribute("d", poly(hull(pp(lp))));
    hcr.setAttribute("d", poly(pp(lp.filter((_, i) => i % 2 === 1))));
    if (phi > 0.5) heap.after(hcr); else hcr.after(heap), hatch.after(heap), heap.before(hatch);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = pp([...rbox(-4, 0, 0, L + 4, Wd, ZT, 6), ...lid(R0)]), xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > bx[0] && x < bx[1] && y > bx[2] && y < bx[3]), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "lanterncarriage",
  means: "A coal tender on its wheels: the pointer swings its long hatch up on the far hinge to show the coal inside.",
  rules: [1, 3, 5, 6],
  range: [50, 80, 95],
  tour: [[200, 147], [170, 135], [230, 160], null],
  mount,
});
