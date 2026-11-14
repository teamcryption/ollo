/**
 * Bench press: a padded bench under a rack, the barbell resting in the hooks
 * with a plate at each end. The pointer's height lifts the bar off the hooks
 * and its left-right tips the bar a little, both on springs. At rest the bar
 * sits just above the hooks, bright. The slider is the reach of the lift.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 10, HZ = 52, PRR = 15, PT = 4, BR = 1.6, YB = 50, YP = 38;
// a disc standing across y: points round (x, z) at width y0..y1
const drum = (P, x, z, r, y0, y1, n = 28) => {
  const pts = [];
  for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2, cx = x + r * Math.cos(t), cz = z + r * Math.sin(t); pts.push(P(cx, y0, cz), P(cx, y1, cz)); }
  return poly(hull(pts));
};
const face = (P, x, z, r, y, n = 28) => {
  const pts = [];
  for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; pts.push(P(x + r * Math.cos(t), y, z + r * Math.sin(t))); }
  return poly(pts);
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-6, -YB - 4, 0], [100, 14, 0], [BX, YB + 4, 0], [BX, -YB, HZ + 4 + 40 + PRR], [BX, YB, HZ + 40 + PRR]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, z0, z1, r, b, par = g) => { const [a, i] = rings(x0, y0, x1, y1, r, b); return put(solid(par), prism(P, front, a, i, z0, z1)); };

  // far upright, far plate and stub (behind everything else)
  block(BX - 3, -YP + 6, BX + 3, -YP + 12, 0, HZ + 6, 2, 0.8);
  const farStub = mk("path", {}, g), farPlate = mk("path", { class: "sil" }, g), farHub = mk("path", { class: "nf lo" }, g);
  // the bench: two legs, then the pad
  block(14, -9, 22, 9, 0, 16, 2, 1);
  block(78, -9, 86, 9, 0, 16, 2, 1);
  block(4, -11, 96, 11, 16, 24, 5, 1.6);
  block(BX - 8, -YP + 6, BX + 8, YP - 6, 0, 2, 3, 1);
  const bar = mk("path", { class: "sil" }, g);
  // near upright, hooks, near plate
  block(BX - 3, YP - 12, BX + 3, YP - 6, 0, HZ + 6, 2, 0.8);
  const nearPlate = mk("path", { class: "sil" }, g), nearHub = mk("path", { class: "nf lo" }, g), nearStub = mk("path", {}, g);

  const REST = 3;
  const lift = spring(REST), tip = spring(0);
  let last = "";
  function draw() {
    const z0 = HZ + lift.x, zf = z0 - tip.x, zn = z0 + tip.x;
    const key = z0.toFixed(2) + tip.x.toFixed(2);
    if (key === last) return;
    last = key;
    const zAt = (y) => z0 + (tip.x * y) / YP;
    farStub.setAttribute("d", drum(P, BX, zAt(-YB), BR + 0.6, -YB, -YP - PT, 14));
    farPlate.setAttribute("d", drum(P, BX, zf, PRR, -YP - PT, -YP));
    farHub.setAttribute("d", face(P, BX, zf, 4, -YP, 16));
    const pts = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2, dx = BR * Math.cos(t), dz = BR * Math.sin(t); pts.push(P(BX + dx, -YP, zf + dz), P(BX + dx, YP, zn + dz)); }
    bar.setAttribute("d", poly(hull(pts)));
    nearPlate.setAttribute("d", drum(P, BX, zn, PRR, YP, YP + PT));
    nearHub.setAttribute("d", face(P, BX, zn, 4, YP + PT, 16));
    nearStub.setAttribute("d", drum(P, BX, zAt(YB), BR + 0.6, YP + PT, YB, 14));
  }
  draw();
  const B = register(stage, (dt) => {
    const a = stepS(lift, dt), b = stepS(tip, dt);
    draw();
    return a || b;
  });
  bag.add(B.unregister);

  const top = P(BX, 0, HZ + 40)[1], base = P(BX, 0, HZ)[1] + 40;
  function setLit(on) { for (const el of [bar, farPlate, nearPlate]) el.classList.toggle("hi", on); }
  function move([sx, sy]) {
    const f = clamp((base - sy) / (base - top), 0, 1);
    lift.t = REST + f * reach;
    tip.t = clamp((sx - 200) / 120, -1, 1) * 4;
    setLit(true);
    read.textContent = "up " + Math.round(f * reach);
    B.wake();
  }
  function leave() { lift.t = REST; tip.t = 0; setLit(true); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "benchpress",
  means: "A bench under a racked barbell: the pointer's height presses the bar up off the hooks, and its side tips the bar.",
  rules: [3, 5, 6, 8],
  range: [10, 30, 40],
  tour: [[185, 90], [116, 124], [295, 260], null],
  mount,
});
