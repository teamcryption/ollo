/**
 * Projector screen: a pull-down screen hanging from its wall case, a weighted
 * bar along its foot and a cord with a ring under it. The pointer's height
 * over the screen pulls it: the bar follows down to the dashed full drop and
 * rolls back up when the pointer goes higher. At rest it hangs part way,
 * the ring bright. The slider is the rest drop.
 *
 * The pattern: one part following the pointer along one axis.
 */
const {
  Cam, clamp, fit, facing, flatDot, open, place, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 170, ZT = 120, MIN = 10, MAX = 98, CORD = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restF = value / 100;
  const C = Cam(45, 0.5, 1.4);
  fit(C, [[-6, -8, ZT + 12], [W + 6, 8, ZT + 12], [-6, 8, ZT + 12], [W + 6, -8, ZT + 12], [0, 0, ZT - MAX - 5 - CORD - 3], [W, 0, ZT - MAX - 5 - CORD - 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the full drop, dashed, behind the cloth it belongs to
  mk("path", { d: open([P(0, 0, ZT - MAX), P(W, 0, ZT - MAX)]) + seg(P(0, 0, ZT - 20), P(0, 0, ZT - MAX)) + seg(P(W, 0, ZT - 20), P(W, 0, ZT - MAX)), class: "dash nf" }, g);
  const cloth = mk("path", { class: "sil" }, g);
  const border = mk("path", { class: "nf lo" }, g);
  const cord = mk("path", { class: "nf lo" }, g);
  const ring = flatDot(g, C, 3, "dot");
  const bar = solid(g);
  const [cr, ci] = rings(-6, -8, W + 6, 8, 7, 2);
  put(solid(g), prism(P, front, cr, ci, ZT, ZT + 12));
  // two wall brackets, ends of the case
  for (const x of [8, W - 8]) mk("path", { d: open([P(x, -8, ZT + 2), P(x, -8, ZT + 10)]), class: "nf lo" }, g);

  const drop = spring(lerpRest());
  function lerpRest() { return MIN + (MAX - MIN) * clamp(restF, 0, 1); }
  let last = NaN;
  function draw(d) {
    const r = Math.round(d * 10) / 10;
    if (r === last) return;
    last = r;
    const zb = ZT - r;
    cloth.setAttribute("d", poly([P(0, 0, ZT), P(W, 0, ZT), P(W, 0, zb), P(0, 0, zb)]));
    border.setAttribute("d", r > 22 ? poly([P(8, 0, ZT - 6), P(W - 8, 0, ZT - 6), P(W - 8, 0, zb + 8), P(8, 0, zb + 8)]) : "");
    const [br, bi] = rings(-3, -3.5, W + 3, 3.5, 3, 1);
    put(bar, prism(P, front, br, bi, zb - 5, zb));
    cord.setAttribute("d", open([P(W / 2, 0, zb - 5), P(W / 2, 0, zb - 5 - CORD)]));
    place(ring, P(W / 2, 0, zb - 5 - CORD - 2));
  }
  draw(drop.x);

  const B = register(stage, (dt) => { const m = stepS(drop, dt); draw(drop.x); return m; });
  bag.add(B.unregister);

  // hit against fixed geometry: vertical lines stay vertical, so x alone bounds the screen
  const xs = [P(0, 0, ZT)[0], P(W, 0, ZT)[0], P(0, 0, ZT - MAX)[0], P(W, 0, ZT - MAX)[0]];
  const x0 = Math.min(...xs) - 10, x1 = Math.max(...xs) + 10;
  const ya = P(W / 2, 0, ZT)[1], yb = P(W / 2, 0, ZT - MAX)[1];
  let on = null;
  function setOn(v) {
    on = v;
    if (v == null) { drop.t = lerpRest(); read.textContent = "rest"; }
    else { drop.t = MIN + (MAX - MIN) * v; read.textContent = Math.round(v * 100) + "%"; }
    bar.sil.classList.toggle("hi", v != null);
    ring.setAttribute("class", v == null ? "dot" : "dot m");
    B.wake();
  }
  function move([sx, sy]) {
    if (sx < x0 || sx > x1 || sy < ya - 30 || sy > yb + 50) return setOn(null);
    setOn(clamp((sy - ya) / (yb - ya), 0, 1));
  }
  setOn(null);
  bag.add(pointer(stage, { move, leave: () => setOn(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restF = v / 100; if (on == null) { drop.t = lerpRest(); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "projectorscreen",
  means: "A pull-down screen under its wall case: the pointer's height pulls the weighted bar down, and it rolls back up as you rise.",
  rules: [1, 3, 5, 8],
  range: [0, 55, 100],
  tour: [[126, 110], [200, 190], [274, 251], null],
  mount,
});
