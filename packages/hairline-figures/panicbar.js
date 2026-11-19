/**
 * Panic bar door: an exit door in its frame, a push bar across it at waist
 * height. The pointer on the door presses the bar in, the latch bolt slides
 * back, and the door swings away on its hinges. At rest it stands a crack
 * open, the bar bright. The slider is how far the door swings.
 */
const {
  Cam, fit, proj, hull, poly, rrect, clamp, rad, tween, tset, tval, tdone, disposer, mk, pointer, register, solid,
} = HL;

const W = 56, H = 104, T = 3, JW = 6, REST = 14;
// a rounded slab: ring in the (a, c) plane, extruded along b; m maps (a, b, c) to world
function slab(P, s, m, a0, a1, c0, c1, b0, b1, r, ins) {
  const ring = rrect(a0, c0, a1, c1, r, 4), pts = [];
  for (const q of ring) pts.push(P(...m(q.u, b0, q.v)), P(...m(q.u, b1, q.v)));
  s.sil.setAttribute("d", poly(hull(pts)));
  s.cr.setAttribute("d", poly(rrect(a0 + ins, c0 + ins, a1 - ins, c1 - ins, Math.max(0.5, r - ins), 4).map((q) => P(...m(q.u, b1, q.v)))));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.98);
  const id = (a, b, c) => [a, b, c];
  const FIT = [[-JW - 8, -6, 0], [W + JW + 8, 12, 0], [-JW, 8, H + 10], [W + JW, -4, H + 10], [W * 0.3, -W * 0.95, H], [W * 0.3, -W * 0.95, 0]];
  fit(C, FIT, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // the sill: a low step under the frame
  slab(P, solid(g), (a, b, c) => [a, c, b], -JW - 8, W + JW + 8, -6, 12, -3, 0, 3, 1.4);
  // the door and its hardware, painted behind the frame
  const dg = mk("g", {}, g);
  const door = solid(dg), win = mk("path", { class: "nf" }, dg), housing = solid(dg), pad = solid(dg), bolt = solid(dg);
  pad.sil.classList.add("hi");
  const fg = mk("g", {}, g);
  slab(P, solid(fg), id, -JW, 0, 0, H + 8, -2, 8, 1.5, 1.2);
  slab(P, solid(fg), id, W, W + JW, 0, H + 8, -2, 8, 1.5, 1.2);
  slab(P, solid(fg), id, -JW, W + JW, H, H + 9, -2, 8, 2, 1.4);
  // hinge knuckles on the near jamb
  for (const z of [16, 52, 88]) slab(P, solid(fg), id, -1.2, 1.2, z, z + 8, 3.2, 5.2, 1, 0.4);

  const sw = tween(REST), push = tween(0);
  let last = "";
  function draw(th, pu) {
    const key = th.toFixed(2) + "/" + pu.toFixed(3);
    if (key === last) return;
    last = key;
    const c = Math.cos(rad(th)), s = Math.sin(rad(th));
    const m = (a, b, z) => [a * c + b * s, -a * s + b * c, z];
    slab(P, door, m, 0.5, W - 0.5, 1, H - 1, 0, T, 2, 2.4);
    const face = (r) => r.map((q) => P(...m(q.u, T, q.v)));
    win.setAttribute("d", poly(face(rrect(15, 64, W - 15, 92, 2, 4))) + poly(face(rrect(17, 66, W - 17, 90, 1.2, 4))));
    slab(P, housing, m, 6, W - 5, 40, 52, T, T + 4, 2, 1);
    slab(P, pad, m, 9, W - 8, 42.5, 49.5, T + 4, T + 8 - 3.5 * pu, 1.6, 0.8);
    slab(P, bolt, m, W - 3 - 6 * pu, W + 2.5 - 6 * pu, 44, 48, 0.8, 2.2, 0.8, 0.3);
  }
  const B = register(stage, (_dt, now) => {
    draw(tval(sw, now), tval(push, now));
    return !(tdone(sw, now) && tdone(push, now));
  });
  bag.add(B.unregister);

  // hit: the door's rest outline on screen, fixed
  const box = [[0, 0, 0], [W, 0, 0], [W, 0, H], [0, 0, H]].map((p) => P(...p));
  const x0 = Math.min(...box.map((p) => p[0])) - 6, x1 = Math.max(...box.map((p) => p[0])) + 6;
  const top = (x) => box[3][1] + ((x - box[3][0]) / (box[2][0] - box[3][0])) * (box[2][1] - box[3][1]);
  const bot = (x) => box[0][1] + ((x - box[0][0]) / (box[1][0] - box[0][0])) * (box[1][1] - box[0][1]);
  const hit = ([x, y]) => x >= x0 && x <= x1 && y >= top(x) - 6 && y <= bot(x) + 6;

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    const now = performance.now();
    tset(push, v ? 1 : 0, now, v ? 0 : 200);
    tset(sw, v ? clamp(max, 15, 85) : REST, now, v ? 160 : 0);
    read.textContent = v ? "open " + Math.round(clamp(max, 15, 85)) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "panicbar",
  means: "An exit door with a push bar: the pointer presses the bar, the latch slides back, and the door swings away.",
  rules: [1, 3, 5, 8],
  range: [20, 70, 85],
  tour: [[200, 174], [222, 140], [182, 205], null],
  mount,
});
