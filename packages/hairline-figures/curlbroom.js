/**
 * Ice scraper: a windscreen pane lying under frost, and a hand scraper on
 * it. The pointer's side slides the scraper along the glass; the frost is
 * gone wherever the blade has passed. Leaving sends it back to a half-cleared
 * rest. At rest the blade is bright. The slider is the blade's width.
 *
 * The pattern: one part answering a continuous input (spring).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const GX = 120, GY = 64, GZ = 4, REST = 45;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let bw = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [GX, GY, 0], [GX, 0, 0], [0, GY, 0], [-30, GY / 2, 40], [GX - 30, GY / 2, 40]], 200, 165);
  const P = proj(C), front = facing(C);
  const pr = (pts) => pts.map((q) => P(q[0], q[1], q[2]));
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(0, 0, GX, GY, 10, 3);
  put(solid(g), prism(P, front, gr, gi, 0, GZ));
  const frost = mk("path", { class: "nf lo" }, g);
  const handle = mk("path", { class: "sil" }, g), blade = mk("path", { class: "sil hi" }, g), edge = mk("path", { class: "nf" }, g);
  const marks = [];
  for (let i = 0; i < 26; i++) for (let j = 0; j < 9; j++) {
    const x = 8 + i * 4.2 + ((j * 7) % 3), y = 8 + j * 6 + ((i * 5) % 3);
    marks.push([x, y]);
  }
  const X = spring(REST, { k: 60, c: 14 });
  let last = NaN, lw = NaN;
  function draw() {
    if (X.x === last && bw === lw) return;
    last = X.x; lw = bw;
    const x = X.x, y0 = GY / 2 - bw / 2, y1 = GY / 2 + bw / 2;
    let d = "";
    for (const [mx, my] of marks) if (mx > x + 3 || my < y0 - 1 || my > y1 + 1) d += seg(P(mx, my, GZ), P(mx + 2, my - 1.2, GZ));
    frost.setAttribute("d", d);
    const bl = [];
    for (const y of [y0, y1]) bl.push([x, y, GZ], [x + 3, y, GZ], [x - 6, y, GZ + 10], [x - 9, y, GZ + 10]);
    blade.setAttribute("d", poly(hull(pr(bl))));
    edge.setAttribute("d", seg(P(x + 1.5, y0, GZ + 0.5), P(x + 1.5, y1, GZ + 0.5)));
    const hd = [];
    for (const y of [GY / 2 - 3, GY / 2 + 3]) hd.push([x - 6, y, GZ + 8], [x - 8, y, GZ + 13], [x - 34, y, GZ + 34], [x - 37, y, GZ + 30]);
    handle.setAttribute("d", poly(hull(pr(hd))));
  }
  const B = register(stage, (dt) => { const m = stepS(X, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();
  read.textContent = "rest";

  const a = P(0, GY / 2, 0), b = P(GX, GY / 2, 0);
  function move([sx]) {
    const f = clamp((sx - a[0]) / (b[0] - a[0]), 0, 1);
    X.t = 12 + f * (GX - 18);
    read.textContent = Math.round(f * 100) + "%";
    B.wake();
  }
  function leave() { X.t = REST; read.textContent = "rest"; B.wake(); }
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { bw = v; B.wake(); last = NaN; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "curlbroom",
  means: "A windscreen ice scraper: the pointer slides the blade along the frosted glass, clearing the frost behind it.",
  rules: [1, 3, 5],
  range: [24, 40, 56],
  tour: [[269, 226], [117, 150], [283, 233], null],
  mount,
});
