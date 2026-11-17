/**
 * Jeweller loupe: a folding pocket loupe, a rounded case with a pivot pin
 * at one end and a glass in its ring swinging out of it. The pointer near it
 * swings the glass out towards the pointer; away, the glass rests half out
 * of its case. The glass ring is bright. The slider is how far it swings.
 *
 * The pattern: a continuous aim on one spring, hit on the ground plane.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, clamp, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const R = 17, D = 24, REST = 1.05;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 4.1);
  fit(C, [[-D - R, -D - R, 0], [D + R + 20, D + R, 0], [D + R + 20, -D - R, 0], [-D - R, D + R, 0], [0, 0, 14]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-14, -R - 3, D + R + 4, R + 3, R + 3, 2);
  put(solid(g), prism(P, front, cr, ci, 0, 7));
  const well = mk("path", { class: "nf lo" }, g);
  well.setAttribute("d", "");
  const lens = solid(g), glass = mk("path", { class: "nf lo" }, lens.g);
  put(solid(g), prism(P, front, disc(0, 0, 3.2, 18), null, 7, 13));
  place(flatDot(g, C, 1.3, "dot m"), P(0, 0, 13));
  lens.sil.classList.add("hi");
  const sw = spring(REST, { k: 90, c: 16 });
  let drawn = NaN;
  function draw() {
    if (Math.abs(sw.x - drawn) < 1e-4) return;
    drawn = sw.x;
    const a = sw.x, x = D * Math.cos(a), y = D * Math.sin(a);
    put(lens, prism(P, front, disc(x, y, R), disc(x, y, R - 3.5), 7, 11));
    const pts = disc(x, y, R - 6, 40).map((q) => P(q.u, q.v, 11));
    glass.setAttribute("d", "M" + pts.map((p) => p.join(",")).join("L") + "Z");
  }
  const B = register(stage, (dt) => { const m = stepS(sw, dt); draw(); return m; });
  bag.add(B.unregister);
  function set(p) {
    let t = REST, lab = "rest";
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 7), r = Math.hypot(x, y);
      if (r < 75) { t = clamp(Math.atan2(y, x), -0.4, 0.4 + 2.8 * reach); lab = Math.round(t * 57.3) + "°"; }
    }
    sw.t = t;
    read.textContent = lab;
    B.wake();
  }
  draw();
  read.textContent = "rest";
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "loupe",
  means: "A folding jeweller's loupe: the glass swings out of its case on the pivot pin, turning to follow the pointer.",
  rules: [1, 3, 4, 5],
  range: [0.4, 1, 1],
  tour: [[41, 140], [171, 151], [260, 120], null],
  mount,
});
