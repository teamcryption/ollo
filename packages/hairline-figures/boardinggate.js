/**
 * Boarding gate: a terminal block with a jet bridge reaching out across the
 * apron, a fixed tunnel and a cab that telescopes over it on a wheeled leg.
 * The pointer's place along the apron sets how far the cab slides out. At
 * rest the cab sits part-way out, bright. The slider is the reach.
 *
 * The pattern: one part following the pointer along an axis.
 */
const { Cam, fit, facing, prism, proj, rings, unproj, clamp, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const REST = 14;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[-34, -14, 0], [160, 60, 0], [160, -14, 0], [-34, 60, 0], [-34, -14, 62], [150, 22, 46]], 200, 166);
  const P = proj(C), front = facing(C);
  const box = (par, x0, y0, x1, y1, z0, z1, r = 3, b = 1.4) => { const [a, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, a, i, z0, z1)); return s; };
  const g = mk("g", {}, svg);
  box(g, -38, -18, 164, 64, 0, 2, 6, 2);
  // guide: where the leg's wheels run
  mk("path", { d: seg(P(84, 22, 2), P(150, 22, 2)), class: "dash" }, g);
  box(g, -30, -10, 30, 54, 2, 60, 5, 2);
  const door = mk("path", { class: "nf lo" }, g);
  door.setAttribute("d", "M" + [P(30, 14, 22), P(30, 14, 44), P(30, 32, 44), P(30, 32, 22)].map((q) => q.join(",")).join("L"));
  box(g, 40, 18, 48, 26, 2, 26, 2, 0.8);
  box(g, 30, 14, 92, 30, 26, 40, 3, 1.2);
  const mov = mk("g", {}, g);
  const sp = spring(REST), lim = () => 14 + reach * 0.4;
  let last = NaN, cab = null;
  function draw(e) {
    if (e === last) return;
    last = e;
    mov.replaceChildren();
    const x1 = 100 + e;
    box(mov, x1 - 20, 12, x1 - 4, 32, 2, 7, 2, 0.8);
    box(mov, x1 - 15, 18, x1 - 9, 26, 7, 23, 2, 0.8);
    cab = box(mov, 50 + e, 11, x1, 33, 23, 43, 3, 1.4);
    cab.sil.classList.add("hi");
    for (let k = 1; k < 4; k++) mk("path", { d: seg(P(50 + e + k * 12.5, 33, 30), P(50 + e + k * 12.5, 33, 38)), class: "lo nf" }, mov);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(REST);
  function aim(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [wx] = unproj(C, p[0], p[1], 0);
    sp.t = clamp(wx - 80, 0, lim());
    read.textContent = "ext " + Math.round(sp.t);
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "boardinggate",
  means: "A jet bridge at a terminal: its cab telescopes out over the apron as far as the pointer reaches along it.",
  rules: [1, 3, 5, 8],
  range: [0, 50, 100],
  tour: [[230, 220], [267, 239], [293, 252], null],
  mount,
});
