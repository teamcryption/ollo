/**
 * Log carrier: a canvas sling laid on the hearth with three logs on it and a
 * wooden dowel along each side flap. The pointer over it folds both flaps up
 * to carry, the dowels meeting over the logs. At rest the far flap is half
 * raised, its dowel bright. The slider is how far the flaps fold.
 */
const { Cam, fit, hull, poly, proj, rad, unproj, spring, stepS, disposer, mk, pointer, register } = HL;

const L = 72, H = 15, F = 32, LR = 7, REST = [58, 12];
function cylX(P, x0, x1, y, z, r) {
  const a = [], b = [];
  for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; a.push(P(x0, y + r * Math.cos(t), z + r * Math.sin(t))); b.push(P(x1, y + r * Math.cos(t), z + r * Math.sin(t))); }
  return { sil: poly(hull(a.concat(b))), cap: poly(b) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let fold = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, -H - F, 0], [L, H + F, 0], [0, H + F, 0], [L, -H - F, 0], [0, 0, F + 4], [L, 0, F + 4]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const back = mk("g", {}, g);
  const farFlap = mk("path", { class: "sil" }, back), farDow = mk("path", { class: "sil" }, back), farCap = mk("path", { class: "nf" }, back);
  mk("path", { d: poly([P(0, -H, 0), P(L, -H, 0), P(L, H, 0), P(0, H, 0)]), class: "sil" }, g);
  mk("path", { d: poly([P(0, -H + 3, 0), P(L, -H + 3, 0)]), class: "dash nf" }, g);
  mk("path", { d: poly([P(0, H - 3, 0), P(L, H - 3, 0)]), class: "dash nf" }, g);
  for (const [y, z] of [[-7.5, LR], [7.5, LR], [0, LR + 12]]) {
    const c = cylX(P, 5, L - 5, y, z, LR);
    mk("path", { d: c.sil, class: "sil" }, g);
    mk("path", { d: c.cap }, g);
    const r2 = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; r2.push(P(L - 5, y + 3 * Math.cos(t), z + 3 * Math.sin(t))); }
    mk("path", { d: poly(r2), class: "nf lo" }, g);
  }
  const front = mk("g", {}, g);
  const nearFlap = mk("path", { class: "sil" }, front), nearDow = mk("path", { class: "sil" }, front), nearCap = mk("path", { class: "nf" }, front);

  const A = [spring(REST[0], { k: 90, c: 16 }), spring(REST[1], { k: 90, c: 16 })];
  const last = [NaN, NaN];
  function flap(side, deg, path, dow, cap) {
    const a = rad(deg), s = side < 0 ? -1 : 1, yy = (d) => s * (H + d * Math.cos(a)), zz = (d) => d * Math.sin(a);
    path.setAttribute("d", poly([P(0, s * H, 0), P(L, s * H, 0), P(L, yy(F), zz(F)), P(0, yy(F), zz(F))]));
    const c = cylX(P, -6, L + 6, yy(F + 1), zz(F + 1), 2.2);
    dow.setAttribute("d", c.sil); cap.setAttribute("d", c.cap);
  }
  function draw() {
    if (A[0].x !== last[0]) { last[0] = A[0].x; flap(-1, A[0].x, farFlap, farDow, farCap); }
    if (A[1].x !== last[1]) { last[1] = A[1].x; flap(1, A[1].x, nearFlap, nearDow, nearCap); }
  }
  draw();
  const B = register(stage, (dt) => { const m0 = stepS(A[0], dt), m1 = stepS(A[1], dt); draw(); return m0 || m1; });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) { if (v) { A[0].t = fold; A[1].t = fold; B.wake(); } return; }
    on = v;
    A[0].t = v ? fold : REST[0]; A[1].t = v ? fold : REST[1];
    farDow.classList.toggle("hi", true); nearDow.classList.toggle("hi", v);
    read.textContent = v ? "carry" : "rest";
    B.wake();
  }
  setOn(false);
  function hit([sx, sy]) { const [x, y] = unproj(C, sx, sy, 0); return x > -12 && x < L + 12 && y > -H - F - 6 && y < H + F + 6; }
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { fold = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "kindling",
  means: "A canvas log carrier on the hearth: the pointer folds both flaps up around the logs, dowel handles meeting on top.",
  rules: [1, 3, 5, 8],
  range: [50, 80, 90],
  tour: [[200, 144], [135, 214], [207, 120], null],
  mount,
});
