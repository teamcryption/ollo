/**
 * Mirror cabinet: a bathroom wall cabinet whose front is a mirror door,
 * hinged on its right edge, over two shelves of bottles. The pointer's
 * place across the figure swings the mirror open. At rest the door stands
 * a little ajar and the lamp over it is lit. The slider is how far it swings.
 *
 * The pattern: one part turning on a hinge (a continuous spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, open, poly, prism, proj, rad, rings, ringAt, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 96, D = 30, H = 104, Z0 = 26, DT = 3, REST = 18;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const BOTTLES = [[16, 5, 22, 0], [30, 4, 16, 0], [44, 5, 26, 0], [22, 4, 18, 1], [40, 6, 14, 1], [64, 4, 20, 1]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.32);
  const far = [W - W * Math.cos(rad(110)), D + W * Math.sin(rad(110))];
  fit(C, [[-14, -6, 0], [-14, -6, Z0 + H + 22], [W + 14, -6, 0], [W + 14, -6, Z0 + H + 22], [W, D, Z0], [0, D, Z0], [W, D, Z0 + H], [far[0], far[1], Z0 + 2], [far[0], far[1], Z0 + H - 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the wall tile it hangs on, then the cabinet and its lamp
  const [wr, wi] = rings(-14, -6, W + 14, -2, 2, 0.8);
  put(solid(g), prism(P, front, wr, wi, 0, Z0 + H + 22));
  const [br, bi] = rings(0, -2, W, D, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, Z0, Z0 + H));
  const [lr, li] = rings(W / 2 - 22, 0, W / 2 + 22, 8, 3, 1);
  put(solid(g), prism(P, front, lr, li, Z0 + H + 6, Z0 + H + 12));
  const lp = P(W / 2 + 14, 8, Z0 + H + 9);
  const lamp = mk("circle", { cx: lp[0], cy: lp[1], r: 2.6, class: "dot" }, g);
  const face = (x0, x1, z0, z1) => [P(x0, D, z0), P(x1, D, z0), P(x1, D, z1), P(x0, D, z1)];
  mk("path", { d: poly(face(5, W - 5, Z0 + 5, Z0 + H - 5)), class: "lo" }, g);
  // two shelves with bottles standing near their front edge
  for (const s of [0, 1]) {
    const zs = Z0 + 6 + s * 48;
    mk("path", { d: open([P(5, D, zs), P(W - 5, D, zs)]), class: "nf lo" }, g);
    for (const [x, r, h, row] of BOTTLES) if (row === s) put(solid(g), prism(P, front, disc(x, D - 8, r), disc(x, D - 8, r - 1.4), zs, zs + h));
  }
  const door = mk("path", { class: "sil" }, g), glint = mk("path", { class: "nf lo" }, g);

  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const at = (u, w, z) => P(W - u * c - w * s, D + u * s - w * c + DT, z);
    const pts = [];
    for (const u of [0, W]) for (const w of [0, DT]) for (const z of [Z0 + 1, Z0 + H - 1]) pts.push(at(u, w, z));
    door.setAttribute("d", poly(hull(pts)));
    const zm = Z0 + H / 2;
    glint.setAttribute("d", open([at(W - 26, 0, zm + 18), at(W - 10, 0, zm + 34)]) + " " + open([at(W - 34, 0, zm + 16), at(W - 14, 0, zm + 36)]));
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const xL = P(0, D, 0)[0] - 30, xR = P(W, 0, 0)[0] + 20;
  function move([sx, sy]) {
    if (sy < 10 || sy > 310) return leave();
    sp.t = lerp(4, maxA, clamp((xR - sx) / (xR - xL), 0, 1));
    door.classList.add("hi"); lamp.setAttribute("class", "dot m");
    read.textContent = Math.round(sp.t) + "°";
    B.wake();
  }
  function leave() {
    sp.t = REST;
    door.classList.remove("hi"); lamp.setAttribute("class", "dot");
    read.textContent = "rest";
    B.wake();
  }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "bathmirror",
  means: "A bathroom mirror cabinet whose mirror door swings open on its hinge as the pointer moves across, showing the shelves of bottles.",
  rules: [1, 3, 5, 8],
  range: [60, 105, 110],
  tour: [[249, 169], [177, 160], [57, 175], null],
  mount,
});
