/**
 * Wool carder: a pair of hand carders, flat paddles faced with rows of wire
 * teeth, each with a handle. The pointer over the pair swings the top carder
 * open on its far edge to show the teeth of the bottom one; leaving lets it
 * fold back, just parted. At rest the top carder is bright. The slider is
 * how far it swings.
 *
 * The pattern: one part on a hinge (lid).
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid, unproj } = HL;

const W = 80, D = 50, H = 5, T = 4, REST = 14, HL0 = 30, HL1 = 50, HD = 34;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = 60 + value * 0.3;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D, 0], [W, D, 0], [0, -12, H + D + 6], [W, -12, H + D + 6], [HL0, -12, H + D + HD + 4], [HL0, D + HD, 0], [HL1, D + HD, 0], [0, 0, H + 8], [W, 0, H + 8]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 4, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  put(solid(g), prism(P, front, ...rings(HL0, D - 2, HL1, D + HD, 3, 1), 0, H));
  let teeth = "";
  for (let i = 0; i < 9; i++) for (let j = 0; j < 5; j++) {
    const a = P(8 + i * 8, 7 + j * 9, H), b = P(9 + i * 8, 7 + j * 9, H + 3);
    teeth += "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + "L" + b[0].toFixed(1) + " " + b[1].toFixed(1);
  }
  mk("path", { d: teeth, class: "nf lo" }, g);
  const lg = mk("g", {}, g);
  const grip = mk("path", { class: "nf" }, lg), lid = mk("path", { class: "sil" }, lg), top = mk("path", { class: "nf" }, lg);
  const ang = tween(REST);
  let last = NaN;
  const L = (x, u, t, a) => P(x, u * Math.cos(a) - t * Math.sin(a), H + u * Math.sin(a) + t * Math.cos(a));
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), pts = [];
    for (const x of [0, W]) for (const u of [0, D]) for (const t of [0, T]) pts.push(L(x, u, t, a));
    lid.setAttribute("d", poly(hull(pts)));
    top.setAttribute("d", poly([L(0, 0, T, a), L(W, 0, T, a), L(W, D, T, a), L(0, D, T, a)]));
    const hp = [];
    for (const x of [HL0, HL1]) for (const u of [D - 2, D + HD]) for (const t of [0, T]) hp.push(L(x, u, t, a));
    grip.setAttribute("d", poly(hull(hp)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? max : REST, performance.now(), 0);
    lid.classList.add("hi");
    read.textContent = o ? Math.round(max) + "°" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H); set(x > -8 && x < W + 8 && y > -8 && y < D + HD); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = 60 + v * 0.3; if (on) { on = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "carder",
  means: "A pair of hand wool carders: the pointer swings the top paddle open on its far edge to bare the wire teeth below.",
  rules: [1, 3, 4, 5, 6],
  range: [0, 50, 100],
  tour: [[193, 242], [216, 287], [166, 199], null],
  mount,
});
