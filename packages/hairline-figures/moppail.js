/**
 * Mop bucket: a rounded bucket with a wringer box clamped on its rim, a
 * press lever rising from the wringer and a mop standing in the water. The
 * pointer's distance from the wringer presses the lever down and leans the
 * mop toward it. At rest the lever stands half raised, bright.
 */
const {
  Cam, fit, facing, open, prism, proj, rings, unproj, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid, flatDot,
} = HL;

const BX = 64, BY = 44, BZ = 30, WX0 = 40, WZ = 12, L = 46;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [BX, BY, 0], [BX, 0, 0], [0, BY, 0], [30, 22, 104], [52, BY + 4, BZ + WZ + L]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // four casters, then the bucket
  for (const [x, y] of [[8, 8], [BX - 8, 8], [8, BY - 8], [BX - 8, BY - 8]]) {
    const d = flatDot(g, C, 2.4, "dot off");
    const [sx, sy] = P(x, y, 0); d.setAttribute("cx", sx); d.setAttribute("cy", sy);
  }
  const [r0, i0] = rings(0, 0, BX, BY, 12, 2);
  put(solid(g), prism(P, front, r0, i0, 3, BZ));
  const [r1, i1] = rings(3, 3, BX - 3, BY - 3, 10, 1.2);
  mk("path", { d: open(r1.map((q) => P(q.u, q.v, BZ))) + "Z", class: "nf lo" }, g);
  const mop = mk("path", { class: "nf" }, g);
  const [wr, wi] = rings(WX0, 2, BX + 2, BY + 2, 4, 1.4);
  put(solid(g), prism(P, front, wr, wi, BZ - 6, BZ + WZ));
  // the press plate slot: two short lines on the wringer's top
  mk("path", { d: open([P(WX0 + 6, 10, BZ + WZ), P(WX0 + 6, BY - 6, BZ + WZ)]), class: "nf lo" }, g);
  const lever = mk("path", { class: "sil" }, g), grip = mk("path", { class: "nf" }, g);

  const press = spring(0.35), lean = spring(0.3);
  let last = "";
  function draw() {
    const a = (75 - 60 * press.x) * Math.PI / 180;
    const px = BX - 2, py = BY + 3, pz = BZ + WZ - 2;
    const ex = px - L * Math.cos(a) * 0.9, ez = pz + L * Math.sin(a);
    const key = press.x.toFixed(3) + lean.x.toFixed(3);
    if (key === last) return;
    last = key;
    lever.setAttribute("d", open([P(px, py, pz), P(ex, py, ez)]) + open([P(px, 1, pz), P(ex, 1, ez)]).replace("M", " M") + open([P(ex, 1, ez), P(ex, py, ez)]).replace("M", " M"));
    grip.setAttribute("d", open([P(ex - 1, 8, ez + 1.5), P(ex - 1, py - 8, ez + 1.5)]));
    const tx = 20 + 14 * lean.x, ty = 22 - 6 * lean.x;
    mop.setAttribute("d", open([P(18, 22, BZ - 2), P(tx, ty, 104)]) + " " + open([P(18, 20, BZ - 2), P(tx, ty - 2, 104)]).replace("M", "M"));
  }
  const B = register(stage, (dt) => {
    const m = stepS(press, dt) | stepS(lean, dt);
    draw();
    return !!m;
  });
  bag.add(B.unregister);
  draw();

  function rest() {
    press.t = 0.35; lean.t = 0.3;
    lever.classList.add("hi");
    read.textContent = "rest";
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BZ);
    const d = Math.hypot(x - (BX - 6), y - BY / 2);
    const R = 40 + reach;
    if (d > R * 1.6) return rest();
    const t = d > R ? 0.09 + 0.22 * (1 - (d - R) / (R * 0.6)) : 1 - 0.69 * (d / R);
    press.t = clamp(t, 0, 1); lean.t = clamp(t, 0, 1);
    lever.classList.add("hi");
    read.textContent = Math.round(press.t * 100) + "%";
    B.wake();
  }
  rest();
  bag.add(pointer(stage, { move, leave: rest }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "moppail",
  means: "A mop bucket with a wringer: the nearer the pointer to the wringer, the further its lever presses down and the mop leans in.",
  rules: [3, 5, 8, 9],
  range: [0, 20, 60],
  tour: [[151, 181], [213, 199], [242, 214], null],
  mount,
});
