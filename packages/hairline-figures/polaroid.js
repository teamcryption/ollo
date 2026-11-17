/**
 * Instant camera: a boxy body with a lens and a viewfinder, and a print
 * half out of the slot under the lens. The pointer, sliding right across
 * the figure, pushes the print out of the slot. At rest the print is part
 * way out, bright. The slider is how far the print can come out.
 *
 * The pattern: one part sliding on its rail.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 40, BY = 46, BZ = 38, LR = 12, LC = [BY / 2, 23], PL = 44, REST = 0.3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[0, 0, 0], [BX + PL + 4, BY, 0], [BX + PL, 0, 0], [0, BY, BZ + 8], [BX + 8, BY, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, x1, y0, y1, z0, z1) => {
    const p = [];
    for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) p.push(P(x, y, z));
    return poly(hull(p));
  };
  // the body, then the viewfinder on top
  const [br, bi] = rings(0, 0, BX, BY, 5, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [vr, vi] = rings(10, 6, 26, 18, 2, 0.8);
  put(solid(g), prism(P, front, vr, vi, BZ, BZ + 7));
  // the lens: a short drum on the front face
  const lensRing = (x, r) => circ(r, 36).map((q) => P(x, LC[0] + q.u, LC[1] + q.v));
  mk("path", { d: poly(hull(lensRing(BX, LR).concat(lensRing(BX + 6, LR)))) }, g);
  mk("path", { d: poly(lensRing(BX + 6, LR)), class: "nf" }, g);
  mk("path", { d: poly(lensRing(BX + 6, LR * 0.55)), class: "nf lo" }, g);
  // the slot under the lens
  mk("path", { d: poly([P(BX, 6, 5), P(BX, BY - 6, 5), P(BX, BY - 6, 7.5), P(BX, 6, 7.5)]), class: "nf lo" }, g);
  // the print
  const pg = mk("g", {}, g);
  const sil = mk("path", { class: "sil" }, pg), win = mk("path", { class: "nf lo" }, pg);
  const sp = spring(REST, { eps: 0.002 });
  let drawn = NaN;
  function draw() {
    const e = sp.x * reach;
    if (e === drawn) return;
    drawn = e;
    const x1 = BX + 2 + e * PL, x0 = x1 - PL;
    sil.setAttribute("d", box(Math.max(x0, BX), x1, 7, BY - 7, 5.5, 7));
    const wx0 = Math.max(x0 + 4, BX + 1), wx1 = x1 - 11;
    win.setAttribute("d", wx1 > wx0 ? poly([P(wx0, 10, 7), P(wx1, 10, 7), P(wx1, BY - 10, 7), P(wx0, BY - 10, 7)]) : "");
  }
  draw();
  sil.classList.add("hi");
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const a = P(BX, BY / 2, 0)[0], b = P(BX + PL, BY / 2, 0)[0];
  function set(t) {
    sp.t = t;
    read.textContent = t === REST ? "rest" : Math.round(t * 100) + "%";
    B.wake();
  }
  set(REST);
  bag.add(pointer(stage, {
    move: ([sx]) => set(Math.round(clamp((sx - a + 60) / (b - a + 40), 0.15, 1) * 20) / 20),
    leave: () => set(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; drawn = NaN; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "polaroid",
  means: "An instant camera with a print in its slot: moving right along the camera pushes the print out from under the lens.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[250, 205], [289, 220], [318, 232], null],
  mount,
});
