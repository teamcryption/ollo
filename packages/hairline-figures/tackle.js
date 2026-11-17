/**
 * Fly box: a shallow box of flies with its lid hinged along the back edge.
 * The pointer over the box swings the lid open to show the rows of flies;
 * leaving lets it settle back ajar. At rest the lid is open a crack, bright.
 * The slider is how far the lid opens.
 *
 * The pattern: one hinged part (open).
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, rad, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid, flatDot, place, seg } = HL;

const W = 90, D = 60, H = 12, T = 4, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, H + D + 4], [0, 0, H + D + 4], [0, D, H]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, r1] = rings(0, 0, W, D, 5, 1.6);
  put(solid(g), prism(P, front, r0, r1, 0, H));
  const [w0] = rings(5, 5, W - 5, D - 5, 3, 1);
  mk("path", { d: poly(w0.map((q) => P(q.u, q.v, H))), class: "nf lo" }, g);
  mk("path", { d: seg(P(W / 2, 5, H), P(W / 2, D - 5, H)), class: "dash" }, g);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
    const x = 14 + i * 9 + (i % 2) * 2, y = 15 + j * 15, d = flatDot(g, C, 1.6, "dot off");
    place(d, P(x, y, H));
    const e = flatDot(g, C, 1.6, (i + j) % 3 ? "dot off" : "dot m");
    place(e, P(W - x, D - y + 2, H));
  }
  const lid = mk("path", { class: "sil" }, g), lidc = mk("path", { class: "nf lo" }, g);
  const ang = tween(REST);
  const rot = (x, d, t, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return P(x, d * c - t * s, H + d * s + t * c); };
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const x of [0, W]) for (const d of [0, D]) for (const t of [0, T]) pts.push(rot(x, d, t, a));
    lid.setAttribute("d", poly(hull(pts)));
    lidc.setAttribute("d", poly([rot(4, 4, T, a), rot(W - 4, 4, T, a), rot(W - 4, D - 4, T, a), rot(4, D - 4, T, a)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? max : REST, performance.now(), 0);
    lid.classList.add("hi");
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: () => set(true), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "tackle",
  means: "A fly box with its lid hinged at the back: the pointer swings the lid open on rows of flies, and leaving lets it fall ajar.",
  rules: [3, 5, 6, 8],
  range: [60, 105, 125],
  tour: [[200, 190], [174, 181], [236, 196], null],
  mount,
});
