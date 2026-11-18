/**
 * Spinning jenny: a long frame with a row of upright spindles at one end, a
 * sliding carriage that clasps the threads, and a big drive wheel standing
 * at its far side. The pointer over the jenny draws the carriage out along
 * the frame, stretching the threads, while the wheel turns its spokes. At
 * rest the carriage is bright. The slider is how far the carriage runs.
 *
 * The pattern: one part on a rail (drawer).
 */
const { Cam, fit, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid, unproj } = HL;

const LX = 130, D = 50, BZ = 5, NS = 8, SX = 10, SZ = 36, C0 = 34, WX = 92, WY = -12, WZ = 42, WR = 32;
const rad = (d) => (d * Math.PI) / 180;
const seg = (a, b) => "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + "L" + b[0].toFixed(1) + " " + b[1].toFixed(1);
const sy = (i) => 8 + i * ((D - 16) / (NS - 1));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = 30 + value * 0.6;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[0, 0, 0], [LX, 0, 0], [0, D, 0], [LX, D, 0], [WX - WR, WY, WZ + WR], [WX + WR, WY, WZ + WR], [WX, WY, WZ + WR], [0, 0, SZ + 2]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const all = () => true;
  put(solid(g), prism(P, all, ...rings(WX - 3, WY - 3, WX + 3, WY + 3, 1.5, 0.8), 0, WZ));
  const ring = (r, y) => { const o = []; for (let i = 0; i < 40; i++) { const t = (i / 40) * 2 * Math.PI; o.push(P(WX + r * Math.cos(t), y, WZ + r * Math.sin(t))); } return o; };
  mk("path", { d: poly(hull(ring(WR, WY - 2).concat(ring(WR, WY + 2)))), class: "nf" }, g);
  mk("path", { d: poly(ring(WR - 3, WY + 2)), class: "nf lo" }, g);
  const spokes = mk("path", { class: "nf" }, g);
  mk("path", { d: poly(hull(ring(4, WY - 3).concat(ring(4, WY + 3)))), class: "" }, g);
  put(solid(g), prism(P, all, ...rings(0, 0, LX, D, 4, 2), 0, BZ));
  put(solid(g), prism(P, all, ...rings(4, 1, LX - 4, 5, 1.5, 0.7), BZ, BZ + 4));
  for (let i = 0; i < NS; i++) {
    const y = sy(i);
    put(solid(g), prism(P, all, ...rings(SX - 1.6, y - 1.6, SX + 1.6, y + 1.6, 1.5, 0.6), BZ, SZ));
  }
  const threads = mk("path", { class: "nf lo" }, g);
  put(solid(g), prism(P, all, ...rings(4, D - 5, LX - 4, D - 1, 1.5, 0.7), BZ, BZ + 4));
  const cg = mk("g", {}, g);
  const car = mk("path", { class: "sil hi" }, cg), carc = mk("path", { class: "nf lo" }, cg);
  const pos = tween(C0);
  let last = NaN;
  function draw(cx) {
    if (cx === last) return;
    last = cx;
    let s = "", k = "";
    for (let i = 0; i < NS; i++) s += seg(P(SX, sy(i), SZ), P(cx, sy(i), SZ - 6));
    threads.setAttribute("d", s);
    const ps = [];
    for (const x of [cx - 4, cx + 4]) for (const y of [-3, D + 3]) for (const z of [BZ + 4, SZ - 2]) ps.push(P(x, y, z));
    car.setAttribute("d", poly(hull(ps)));
    carc.setAttribute("d", seg(P(cx - 4, D + 3, SZ - 8), P(cx + 4, D + 3, SZ - 8)) + seg(P(cx + 4, -3, SZ - 8), P(cx + 4, D + 3, SZ - 8)));
    const a = rad((cx - C0) * 5 + 15);
    for (let i = 0; i < 6; i++) { const t = a + (i / 6) * 2 * Math.PI; k += seg(P(WX, WY + 2, WZ), P(WX + (WR - 3) * Math.cos(t), WY + 2, WZ + (WR - 3) * Math.sin(t))); }
    spokes.setAttribute("d", k);
  }
  const B = register(stage, (_dt, now) => { draw(tval(pos, now)); return !tdone(pos, now); });
  bag.add(B.unregister);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(pos, o ? C0 + max : C0, performance.now(), 0);
    read.textContent = o ? "+" + Math.round(max) : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([px, py]) => { const [x, y] = unproj(C, px, py, BZ); set(x > -30 && x < LX + 30 && y > -40 && y < D + 30); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = 30 + v * 0.6; if (on) { on = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "spinningjenny",
  means: "A spinning jenny: the pointer draws the carriage out along the frame, stretching the threads off the spindles as the wheel turns.",
  rules: [1, 3, 4, 5, 6],
  range: [0, 50, 100],
  tour: [[159, 143], [305, 230], [88, 182], null],
  mount,
});
