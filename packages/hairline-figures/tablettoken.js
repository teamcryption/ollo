/**
 * Token machine: a single-line tablet instrument, a tall cabinet on a plinth
 * with a dial on its face and a slide at its foot. The pointer, drawn out in
 * front of the cabinet, pulls the slide toward it, and once it is far enough
 * out the tablet shows in its tray; the dial's needle follows the slide. At
 * rest the slide stands a little open, its front bright.
 */
const {
  Cam, circ, fit, facing, open, poly, prism, proj, rings, unproj, clamp,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const W = 60, D = 40, H = 84, REST = 12, ZP = 20;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-6, -6, 0], [W + 6, -6, 0], [-6, D + 6, 0], [W + 6, D + 6, 0], [0, 0, H + 4], [8, D + 54, 10], [52, D + 54, 30]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-6, -6, W + 6, D + 6, 5, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 4));
  const [cr, ci] = rings(0, 0, W, D, 4, 1.5);
  put(solid(g), prism(P, front, cr, ci, 4, H));
  const [tr, ti] = rings(-3, -3, W + 3, D + 3, 4, 1.5);
  put(solid(g), prism(P, front, tr, ti, H, H + 4));
  // the dial on the front face (y = D) and the slot the slide runs in
  const face = (x, z) => P(x, D, z);
  mk("path", { d: poly(circ(11, 32).map((q) => face(30 + q.u, 58 + q.v))), class: "nf" }, g);
  mk("path", { d: poly([face(8, 9), face(52, 9), face(52, 31), face(8, 31)]), class: "nf lo" }, g);
  const needle = mk("path", { class: "nf" }, g);
  const dg = mk("g", {}, g);
  const tray = solid(dg), tab = solid(dg), plate = solid(dg), pull = solid(dg);
  plate.sil.classList.add("hi");

  const out = spring(REST);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    const [ar, ai] = rings(11, D - 2, 49, D + o + 0.5, 1.5, 0.8);
    put(tray, prism(P, front, ar, ai, 12, 24));
    if (o > 26) {
      const cy = D + o - 13;
      put(tab, prism(P, front, disc(30, cy, 9), disc(30, cy, 6.5), 24, 26));
    } else put(tab, { sil: "", crease: "" });
    const [fr, fi] = rings(8, D + o, 52, D + o + 4, 1.5, 0.8);
    put(plate, prism(P, front, fr, fi, 10, 30));
    const [kr, ki] = rings(23, D + o + 4, 37, D + o + 7, 1.5, 0.6);
    put(pull, prism(P, front, kr, ki, 18, 22));
    const a = (-150 + (o / 46) * 120) * Math.PI / 180;
    needle.setAttribute("d", open([face(30, 58), face(30 + 9 * Math.cos(a), 58 - 9 * Math.sin(a))]));
  }

  const B = register(stage, (dt) => { const m = stepS(out, dt); draw(out.x); return m; });
  bag.add(B.unregister);

  function aim([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, ZP);
    if (x < -10 || x > W + 10 || y < D - 20 || y > D + 80) return null;
    return clamp(y - D - 4, 0, reach);
  }
  function setAim(o) {
    out.t = o === null ? REST : o;
    read.textContent = o === null ? "rest" : o > 26 ? "tablet" : "pull " + Math.round(o);
    B.wake();
  }
  draw(REST);
  setAim(null);
  bag.add(pointer(stage, { move: (p) => setAim(aim(p)), leave: () => setAim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "tablettoken",
  means: "A single-line token instrument: the slide at its foot pulls out toward the pointer and shows the tablet in its tray.",
  rules: [1, 3, 5, 8],
  range: [30, 46, 46],
  tour: [[121, 247], [169, 223], [135, 240], null],
  mount,
});
