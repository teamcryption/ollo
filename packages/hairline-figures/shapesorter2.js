/**
 * Shape sorter: a toy cube whose hinged lid carries three holes, a circle,
 * a square and a triangle. The pointer over the cube swings the lid open on
 * its back hinge. At rest the lid stands ajar, bright. The slider is how far
 * the lid opens.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const W = 70, D = 70, H = 50, T = 4, REST = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, H + D * 0.95 + T], [W, 0, H + D * 0.95 + T]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, r1] = rings(0, 0, W, D, 5, 2);
  put(solid(g), prism(P, front, r0, r1, 0, H));
  const lid = mk("path", { class: "sil" }, g), top = mk("path", { class: "nf lo" }, g);
  const holes = [0, 1, 2].map(() => mk("path", { class: "nf" }, g));
  const L = (a) => (u, v, w) => P(u, v * Math.cos(a) - w * Math.sin(a), H + v * Math.sin(a) + w * Math.cos(a));
  const shapes = [
    circ(9, 24).map((q) => [20 + q.u, 26 + q.v]),
    [[42, 18], [58, 18], [58, 34], [42, 34]],
    [[35, 44], [45, 60], [25, 60]],
  ];
  const ang = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const f = L(rad(deg)), pts = [];
    for (const u of [0, W]) for (const v of [0, D]) for (const w of [0, T]) pts.push(f(u, v, w));
    lid.setAttribute("d", poly(hull(pts)));
    top.setAttribute("d", poly([f(0, 0, T), f(W, 0, T), f(W, D, T), f(0, D, T)]));
    shapes.forEach((s, i) => holes[i].setAttribute("d", poly(s.map(([u, v]) => f(u, v, T)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const sp = [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, H + 20], [W, D, H + 20]].map((p) => P(...p));
  const bx = [Math.min(...sp.map((p) => p[0])), Math.max(...sp.map((p) => p[0])), Math.min(...sp.map((p) => p[1])), Math.max(...sp.map((p) => p[1]))];
  const inside = ([sx, sy]) => sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3];
  let on = null;
  function setOn(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? maxA : REST, performance.now(), 0);
    lid.classList.add("hi");
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "shapesorter2",
  means: "A shape sorter cube: the pointer over it swings the lid with its three shape holes open on the back hinge.",
  rules: [1, 3, 4, 5],
  range: [40, 75, 85],
  tour: [[193, 179], [210, 200], [175, 165], null],
  mount,
});
