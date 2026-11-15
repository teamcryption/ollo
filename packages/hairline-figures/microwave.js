/**
 * Microwave: a countertop oven with a hinged door on its front face and a
 * turntable inside. The pointer's place across the figure swings the door
 * open, and the turntable turns with it. At rest the door stands ajar and
 * the start button is lit. The slider is how far the door can swing.
 *
 * The pattern: one part turning on a hinge (a continuous spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, poly, prism, proj, rad, rings, ringAt, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 112, D = 70, H = 62, DW = 80, DT = 3, REST = 22;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.72);
  const far = [DW * Math.cos(rad(110)), D + DW * Math.sin(rad(110))];
  fit(C, [[0, 0, 0], [W, 0, H], [W, D, 0], [0, D, H], [far[0], far[1], 4], [far[0], far[1], H - 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 7, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the cavity opening on the front face, and the turntable inside it
  const face = (x0, x1, z0, z1) => [P(x0, D, z0), P(x1, D, z0), P(x1, D, z1), P(x0, D, z1)];
  mk("path", { d: poly(face(6, DW - 4, 9, H - 8)), class: "lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(40, D - 20, 17), 10)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(40, D - 20, 5, 20), 10)), class: "nf lo" }, g);
  const roller = mk("circle", { r: 2.2, class: "dot m" }, g);
  // the control strip, its keypad dots, and the start button
  mk("path", { d: poly(face(DW + 6, W - 6, 8, H - 8)), class: "nf lo" }, g);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) {
    const [sx, sy] = P(DW + 13 + c * 10, D, H - 18 - r * 9);
    mk("circle", { cx: sx, cy: sy, r: 1.6, class: "dot off" }, g);
  }
  const [bx, by] = P(DW + 18, D, 16);
  const start = mk("circle", { cx: bx, cy: by, r: 3, class: "dot" }, g);
  // the door: a thin plate on a hinge at x 0, with its window and handle
  const door = mk("path", { class: "sil" }, g), win = mk("path", { class: "nf lo" }, g), handle = mk("path", { class: "nf" }, g);

  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const at = (u, w, z) => P(u * c - w * s, D + u * s + w * c, z);
    const pts = [];
    for (const u of [0, DW]) for (const w of [0, DT]) for (const z of [4, H - 4]) pts.push(at(u, w, z));
    door.setAttribute("d", poly(hull(pts)));
    win.setAttribute("d", poly([at(8, DT, 11), at(DW - 16, DT, 11), at(DW - 16, DT, H - 11), at(8, DT, H - 11)]));
    handle.setAttribute("d", poly([at(DW - 9, DT, 14), at(DW - 5, DT, 14), at(DW - 5, DT, H - 14), at(DW - 9, DT, H - 14)]));
    const t = rad(a * 2.4);
    const [rx, ry] = P(40 + 13 * Math.cos(t), D - 20 + 13 * Math.sin(t), 10);
    roller.setAttribute("cx", rx); roller.setAttribute("cy", ry);
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const xL = P(0, D, 0)[0] - 40, xR = P(W, 0, 0)[0];
  function move([sx, sy]) {
    if (sy < 20 || sy > 300) return leave();
    const f = clamp((xR - sx) / (xR - xL), 0, 1);
    sp.t = lerp(4, maxA, f);
    door.classList.add("hi"); start.setAttribute("class", "dot m");
    read.textContent = Math.round(sp.t) + "°";
    B.wake();
  }
  function leave() {
    sp.t = REST;
    door.classList.remove("hi"); start.setAttribute("class", "dot");
    read.textContent = "rest";
    B.wake();
  }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "microwave",
  means: "A microwave whose door swings open as the pointer moves across it, the turntable inside turning along with it.",
  rules: [1, 3, 5, 8],
  range: [60, 105, 110],
  tour: [[300, 160], [200, 158], [103, 146], null],
  mount,
});
