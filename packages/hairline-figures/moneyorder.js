/**
 * Receipt book: a block of receipt leaves with a carbon sheet on top and a
 * cover hinged along its far edge. The pointer over the book swings the
 * cover open, bright. At rest the cover stands a little ajar.
 * The slider is how far it opens.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, tween, tset, tval, tdone, mk, solid, put, register, pointer, disposer, rad } = HL;
const W = 48, Dp = 32, T = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-W, -Dp, 0], [W, Dp, 0], [-W, Dp, 0], [W, -Dp, 0], [-W, -Dp, T + 2 * Dp], [W, -Dp, T + 2 * Dp]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-W + 2, -Dp + 2, W - 2, Dp - 1, 3, 1.5);
  put(solid(g), prism(P, front, pr, pi, 0, T));
  const [cr, ci] = rings(-W + 8, -Dp + 8, W - 6, Dp - 5, 2, 1);
  put(solid(g), prism(P, front, cr, ci, T, T + 0.8));
  const line = mk("path", { class: "nf" }, g);
  let d = "";
  for (let k = 0; k < 3; k++) { const a = P(-W + 16, -Dp + 16 + k * 10, T + 0.8), b = P(W - 18 - k * 14, -Dp + 16 + k * 10, T + 0.8); d += `M${a[0]},${a[1]}L${b[0]},${b[1]}`; }
  line.setAttribute("d", d);
  const cover = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf" }, g);
  const ang = tween(18);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const tf = ([x, v, w]) => P(x, -Dp + v * c - w * s, T + 1 + v * s + w * c);
    const pts = [];
    for (const x of [-W, W]) for (const v of [0, 2 * Dp]) for (const w of [0, 2]) pts.push(tf([x, v, w]));
    cover.setAttribute("d", poly(hull(pts)));
    face.setAttribute("d", poly([[-W, 0, 2], [W, 0, 2], [W, 2 * Dp, 2], [-W, 2 * Dp, 2]].map(tf)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  cover.classList.add("hi");
  const ctr = P(0, 0, T);
  let act = -1;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a ? amp : 18, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - ctr[0]) < 110 && Math.abs(sy - ctr[1]) < 70 ? 1 : 0), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { tset(ang, amp, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "moneyorder",
  means: "A receipt book with a carbon sheet: the pointer over it swings the hinged cover open to show the leaves.",
  rules: [1, 3, 4, 5],
  range: [60, 95, 110],
  tour: [[200, 212], [168, 164], [200, 212], null],
  mount,
});
