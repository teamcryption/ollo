/**
 * Retractable awning: a house wall with a window, a round roller cassette
 * under the eaves, a canvas on two folding arms and a scalloped valance, with
 * a crank rod hanging at one end. The pointer's distance from the wall sets
 * how far the canvas runs out. At rest it is part way out, its valance bright.
 * The slider is how far it can reach.
 *
 * The pattern: one part following a continuous input (spring); the hit is the ground plane.
 */
const {
  Cam, fit, facing, prism, proj, rings, clamp, spring, stepS, poly, open, seg, rad, unproj, hull,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 30, MIN = 8, MAX = 66, PITCH = rad(16), Y0 = 4, Y1 = 86, ZB = 66, A = 36, ZS = 44, RR = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, px = null;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, 0, 0], [-6, 90, 0], [0, 0, 78], [0, 90, 78], [4 + MAX * Math.cos(PITCH), 4, ZB - MAX * Math.sin(PITCH) - 9], [4 + MAX * Math.cos(PITCH), 86, ZB - MAX * Math.sin(PITCH) - 9]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wo, wi] = rings(-6, 0, 0, 90, 2, 1.2);
  put(solid(g), prism(P, front, wo, wi, 0, 78));
  // the window, with its sill and glazing bar
  mk("path", { class: "nf lo", d: poly([P(0, 30, 14), P(0, 62, 14), P(0, 62, 48), P(0, 30, 48)]) + seg(P(0, 46, 14), P(0, 46, 48)) + seg(P(0, 30, 31), P(0, 62, 31)) }, g);
  mk("path", { class: "nf", d: poly([P(0, 27, 12), P(4, 27, 12), P(4, 65, 12), P(0, 65, 12)]) }, g);
  // the roller cassette: a tube along y
  const tube = (y) => Array.from({ length: 20 }, (_, i) => { const t = (i / 20) * Math.PI * 2; return P(RR + RR * Math.cos(t), y, ZB + 2 + RR * Math.sin(t)); });
  mk("path", { d: poly(hull(tube(Y0 - 2).concat(tube(Y1 + 2)))) }, g);
  const arms = mk("path", { class: "nf" }, g);
  const cloth = mk("path", {}, g), seams = mk("path", { class: "nf lo" }, g);
  const bar = mk("path", {}, g), val = mk("path", { class: "sil hi" }, g);
  const crank = mk("path", { class: "nf" }, g);

  let last = NaN;
  function draw(E) {
    if (Math.abs(E - last) < 0.05) return;
    last = E;
    const fx = RR + E * Math.cos(PITCH), fz = ZB - E * Math.sin(PITCH);
    cloth.setAttribute("d", poly([P(RR, Y0, ZB), P(RR, Y1, ZB), P(fx, Y1, fz), P(fx, Y0, fz)]));
    let d = "";
    for (let k = 1; k < 6; k++) { const y = Y0 + (Y1 - Y0) * k / 6; d += seg(P(RR, y, ZB), P(fx, y, fz)); }
    seams.setAttribute("d", d);
    bar.setAttribute("d", poly(hull([P(fx - 1.5, Y0, fz + 1.5), P(fx + 1.5, Y0, fz + 1.5), P(fx + 1.5, Y0, fz - 2), P(fx - 1.5, Y0, fz - 2), P(fx - 1.5, Y1, fz + 1.5), P(fx + 1.5, Y1, fz + 1.5), P(fx + 1.5, Y1, fz - 2), P(fx - 1.5, Y1, fz - 2)])));
    // the valance: a scalloped hem under the front bar
    const pts = [P(fx + 1.5, Y0, fz - 2)];
    for (let i = 0; i <= 48; i++) { const y = Y0 + (Y1 - Y0) * i / 48; pts.push(P(fx + 1.5, y, fz - 2 - 7 + 2.5 * Math.abs(Math.sin((i / 48) * Math.PI * 7)))); }
    pts.push(P(fx + 1.5, Y1, fz - 2));
    val.setAttribute("d", poly(pts));
    let ad = "";
    for (const [sy, dir] of [[Y0 + 8, 1], [Y1 - 8, -1]]) {
      const ex = fx - 1, dz = fz - 2 - ZS, h = Math.hypot(ex, dz) / 2;
      const side = Math.sqrt(Math.max(0, A * A - h * h));
      const e = P(ex / 2, sy + dir * side, ZS + dz / 2);
      ad += seg(P(0, sy, ZS), e) + seg(e, P(ex, sy, fz - 2));
    }
    arms.setAttribute("d", ad);
    const ca = Math.min(E / 40, 1) * 0.6;
    crank.setAttribute("d", open([P(RR, Y1 + 3, ZB), P(RR + 4 + 10 * ca, Y1 + 3, 30), P(RR + 9 + 10 * ca, Y1 + 3, 30)]));
  }

  const ext = spring(REST);
  draw(REST);
  let on = false;
  const B = register(stage, (dt) => { const m = stepS(ext, dt); draw(ext.x); show(); return m; });
  bag.add(B.unregister);
  function show() { read.textContent = on ? "out " + Math.round(ext.x) : "rest"; }
  function aim() { ext.t = px == null ? REST : MIN + clamp((px - 6) / 70, 0, 1) * (MAX - MIN) * reach; B.wake(); }
  show();
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { on = true; px = unproj(C, sx, sy, 0)[0]; aim(); },
    leave: () => { on = false; px = null; aim(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; aim(); }, destroy: bag.dispose };
}

hairline({
  name: "awning3",
  means: "A retractable awning on a house wall: move the pointer away from the wall and the canvas runs out on its folding arms.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[273, 286], [206, 166], [245, 235], null],
  mount,
});
