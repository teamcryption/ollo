/**
 * Toy chest: a low chest with a thick domed lid hinged along its back edge.
 * The pointer over the chest swings the lid open on its hinge; at rest the
 * lid sits a little ajar, bright. The slider is how far the lid swings.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 64, D = 40, H = 28, T = 9, REST = 0.18, MAX = 1.75;
function lidPts(a) {
  const c = Math.cos(a), s = Math.sin(a), out = [];
  for (const x of [0, W]) for (const y of [0, D]) for (const z of [0, T]) {
    const yy = y, zz = z + (y > 0 && z > 0 ? 0 : 0);
    out.push([x, yy * c - zz * s, H + yy * s + zz * c]);
  }
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[0, 0, 0], [W, D, 0], [0, D, 0], [W, 0, 0], ...lidPts(0), ...lidPts(MAX)], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-3, -3, W + 3, D + 3, 3, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  const [cr, ci] = rings(0, 0, W, D, 3, 3);
  put(solid(g), prism(P, front, cr, ci, 3, H));
  const lid = mk("path", { class: "sil hi" }, g), band = mk("path", { class: "nf lo" }, g), lock = mk("path", { class: "nf" }, g);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = lidPts(a), sp = pts.map((p) => P(...p));
    lid.setAttribute("d", poly(hull(sp)));
    // the front face of the lid, where the latch hangs
    const c = Math.cos(a), s = Math.sin(a), f = (x, z) => P(x, D * c - z * s, H + D * s + z * c);
    band.setAttribute("d", poly([f(0, T), f(W, T), f(W, 0), f(0, 0)]));
    lock.setAttribute("d", poly([f(W / 2 - 4, 3), f(W / 2 + 4, 3), f(W / 2 + 4, -5), f(W / 2 - 4, -5)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const box = hull([[0, 0, 0], [W, D, 0], [0, D, 0], [W, 0, 0], [0, 0, H + T], [W, D, H + T], [0, D, H + T], [W, 0, H + T]].map((p) => P(...p)));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) - 10 && sy < Math.max(...ys);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? MAX * amt : REST, performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(ang, MAX * amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "toybox2",
  means: "A toy chest with a thick lid hinged at the back: the pointer over it swings the lid open, and leaving lets it fall back ajar.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[147, 182], [162, 200], [200, 250], null],
  mount,
});
