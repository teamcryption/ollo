/**
 * Roof window: a pitched roof slope with a window set into it. The pointer's
 * height over the window turns its sash on the centre pivot, top out, bottom
 * in, on a spring; the half that swings in shows only through the opening.
 * At rest the sash stands a little turned and its handle is bright.
 *
 * The pattern: one continuous value from the pointer's screen y against the
 * window's fixed rest box, so the turning sash never moves the hit.
 */
const {
  Cam, clamp, fit, lerp, poly, proj, rad, seg, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const PIT = rad(34), Y0 = 70, RL = 92, RU = 84;
const WX0 = 22, WX1 = 70, WU0 = 16, WU1 = 70, AX = (WU0 + WU1) / 2, HV = (WU1 - WU0) / 2 - 2.5, REST = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  // world point on the roof plane: x across, u up the slope, n out of it
  const W = (x, u, n = 0) => [x, Y0 - u * Math.cos(PIT) + n * Math.sin(PIT), u * Math.sin(PIT) + n * Math.cos(PIT)];
  fit(C, [W(0, 0, -6), W(RL, 0, -6), W(0, RU), W(RL, RU), W(WX0, AX, 22), W(WX1, AX, 22)], 200, 168);
  const P0 = proj(C), P = (x, u, n) => P0(...W(x, u, n));

  const g = mk("g", {}, svg);
  const ring = (i, n) => [P(WX0 - i, WU0 - i, n), P(WX1 + i, WU0 - i, n), P(WX1 + i, WU1 + i, n), P(WX0 - i, WU1 + i, n)];
  const hole = (i, n) => poly(ring(i, n).reverse());
  // the half that swings in goes first: the roof, cut by the opening, hides all but what shows through it
  const sashIn = mk("path", { class: "" }, g);
  mk("path", { class: "sil", d: poly([P(0, 0, -5), P(RL, 0, -5), P(RL, 0, 0), P(RL, RU, 0), P(0, RU, 0), P(0, 0, 0)]) + hole(0, 0) }, g);
  mk("path", { class: "nf lo", d: seg(P(0, 0, 0), P(RL, 0, 0)) + seg(P(1.5, RU - 6, 0), P(RL - 1.5, RU - 6, 0)) + seg(P(1.5, 6, 0), P(RL - 1.5, 6, 0)) }, g);
  // frame: a curb standing out of the slope round the opening
  mk("path", { class: "", d: poly(ring(3, 2.5)) + hole(0, 2.5) }, g);
  mk("path", { class: "nf lo", d: poly(ring(0, 2.5)) }, g);
  const sashOut = mk("path", { class: "sil" }, g);
  const glass = mk("path", { class: "nf lo" }, g);
  const handle = mk("circle", { class: "dot", r: 3 }, g);

  // sash point: v along the slope from the pivot, turned by a degrees, top out
  const S = (x, v, a) => P(x, AX + v * Math.cos(rad(a)), 2.5 + v * Math.sin(rad(a)));
  let last = null;
  function draw(a) {
    const k = a.toFixed(2);
    if (k === last) return;
    last = k;
    const x0 = WX0 + 1, x1 = WX1 - 1;
    sashIn.setAttribute("d", poly([S(x0, -HV, a), S(x1, -HV, a), S(x1, 0, a), S(x0, 0, a)]));
    sashOut.setAttribute("d", poly([S(x0, 0, a), S(x1, 0, a), S(x1, HV, a), S(x0, HV, a)]));
    glass.setAttribute("d", poly([S(x0 + 3, 2, a), S(x1 - 3, 2, a), S(x1 - 3, HV - 3, a), S(x0 + 3, HV - 3, a)]) + seg(S(x0 + 3, HV / 2, a), S(x1 - 3, HV / 2, a)) + seg(S((x0 + x1) / 2, 2, a), S((x0 + x1) / 2, HV - 3, a)));
    const h = S((x0 + x1) / 2, HV - 1.5, a);
    handle.setAttribute("cx", h[0]); handle.setAttribute("cy", h[1]);
  }

  const s = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  // hit: the opening's fixed screen box; height within it sets the turn
  const box = ring(3, 2.5), xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const xa = Math.min(...xs) - 20, xb = Math.max(...xs) + 20, ya = Math.min(...ys), yb = Math.max(...ys);
  function move([sx, sy]) {
    if (sx < xa || sx > xb || sy < ya - 60 || sy > yb + 30) return leave();
    const t = clamp((yb + 10 - sy) / (yb - 10 - ya), 0, 1);
    s.t = lerp(0, reach, t);
    sashOut.setAttribute("class", "sil hi");
    handle.setAttribute("class", "dot off");
    read.textContent = Math.round(s.t) + "°";
    B.wake();
  }
  function leave() {
    s.t = REST;
    sashOut.setAttribute("class", "sil");
    handle.setAttribute("class", "dot");
    read.textContent = "rest";
    B.wake();
  }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "skylightwin",
  means: "A roof window in a pitched slope: raise the pointer over it and the sash turns on its centre pivot, top out.",
  rules: [1, 3, 5, 8],
  range: [40, 80, 85],
  tour: [[160, 218], [191, 171], [216, 113], null],
  mount,
});
