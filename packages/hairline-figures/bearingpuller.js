/**
 * Gear puller: a two-jaw puller hooked under a gear on a shaft. The pointer's
 * height turns the T-handle, and the forcing screw draws the yoke, jaws and
 * gear up the shaft. Leaving lets it settle back. At rest the handle is
 * bright. The slider is how far the gear can be pulled.
 *
 * The pattern: one part answering a continuous input (spring).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, spring, stepS, clamp, circ,
  disposer, mk, pointer, put, register, solid,
} = HL;

const GZ = 16, GT = 6, YZ = 52, TOP = 100, JX = 25;
const disc = (r, n = 28) => circ(r, n).map((q) => ({ ...q }));
const cyl = (r, z0, z1) => { const o = []; for (let i = 0; i < 24; i++) { const t = (i / 24) * 2 * Math.PI; o.push([r * Math.cos(t), r * Math.sin(t), z0], [r * Math.cos(t), r * Math.sin(t), z1]); } return o; };
const box = (x0, y0, z0, x1, y1, z1, a = 0) => {
  const o = [], c = Math.cos(a), s = Math.sin(a);
  for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x * c - y * s, x * s + y * c, z]);
  return o;
};
const teeth = (z) => { const o = []; for (let i = 0; i < 64; i++) { const t = (i / 64) * 2 * Math.PI, r = i % 4 < 2 ? 22 : 19; o.push([r * Math.cos(t), r * Math.sin(t), z]); } return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxL = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-30, -30, 0], [30, 30, 0], [-30, 30, 0], [30, -30, 0], [0, 0, TOP + 4], [-JX - 4, 0, YZ + 34], [JX + 4, 0, YZ + 34], [17, 17, TOP], [-17, -17, TOP]], 200, 162);
  const P = proj(C), front = facing(C);
  const pr = (pts) => pts.map((q) => P(q[0], q[1], q[2]));
  const H = (pts) => poly(hull(pr(pts)));
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-30, -30, 30, 30, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  const farJaw = mk("path", { class: "sil" }, g);
  put(solid(g), prism(P, front, disc(6), disc(4.5), 5, 34));
  const gear = mk("path", { class: "sil" }, g), gearTop = mk("path", { class: "nf" }, g), bore = mk("path", { class: "nf lo" }, g);
  const lowScrew = mk("path", {}, g);
  const nearJaw = mk("path", { class: "sil" }, g), yoke = mk("path", { class: "sil" }, g);
  mk("path", { d: H(cyl(2.8, YZ, TOP - 2)) }, g);
  const handle = mk("path", { class: "sil hi" }, g);
  mk("path", { d: H(cyl(4, TOP - 5, TOP + 2)) }, g);

  const L = spring(3, { k: 60, c: 14 });
  let last = NaN;
  function draw() {
    if (L.x === last) return;
    last = L.x;
    const l = L.x, gz = GZ + l, yz = YZ + l;
    const jaw = (sx) => H(box(sx * JX - 3, -3, gz - 4, sx * JX + 3, 3, yz + 4).concat(box(sx * 17, -3, gz - 4, sx * JX, 3, gz - 1)));
    farJaw.setAttribute("d", jaw(-1));
    nearJaw.setAttribute("d", jaw(1));
    gear.setAttribute("d", H(teeth(gz).concat(teeth(gz + GT))));
    gearTop.setAttribute("d", poly(pr(teeth(gz + GT))));
    bore.setAttribute("d", poly(pr(cyl(6.5, gz + GT, gz + GT).filter((_, i) => i % 2 === 0))));
    lowScrew.setAttribute("d", H(cyl(2.8, 34, yz)));
    yoke.setAttribute("d", H(box(-JX - 5, -5, yz, JX + 5, 5, yz + 7)));
    handle.setAttribute("d", H(box(-18, -1.6, TOP - 3, 18, 1.6, TOP, 0.6 + l * 0.22)));
  }
  const B = register(stage, (dt) => { const m = stepS(L, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();
  read.textContent = "rest";

  const base = P(0, 0, 0);
  function move([sx, sy]) {
    const f = clamp((base[1] - sy) / 200, 0, 1);
    L.t = 3 + f * (maxL - 3);
    read.textContent = Math.round(L.t) + "mm";
    B.wake();
  }
  function leave() { L.t = 3; read.textContent = "rest"; B.wake(); }
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxL = v; }, destroy: bag.dispose };
}

hairline({
  name: "bearingpuller",
  means: "A gear puller on a shaft: the pointer turns the screw's T-handle and the jaws draw the gear up the shaft.",
  rules: [1, 3, 5, 6],
  range: [12, 24, 30],
  tour: [[200, 69], [200, 237], [200, 150], null],
  mount,
});
