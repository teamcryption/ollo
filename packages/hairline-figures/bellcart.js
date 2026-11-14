/**
 * Luggage scale: a hand scale hangs a suitcase from its hook above a floor
 * plate. The pointer's height lifts the scale, and the case rises clear of
 * the floor with it; the read-out gives the weight once the case is off the
 * ground. At rest the case hangs a little clear, the scale bright. The
 * slider is the reach of the lift.
 *
 * The pattern: one part following a continuous input (spring).
 */
const {
  Cam, fit, facing, prism, proj, rings, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid, seg, open, poly,
} = HL;

const W = 44, D = 18, H = 46, REST = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-10, -10, 0], [W + 10, D + 10, 0], [W + 10, -10, 0], [-10, D + 10, 0], [22, 9, 34 + H + 52]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-10, -10, W + 10, D + 10, 6, 2);
  put(solid(g), prism(P, front, fr, fi, -3, 0));

  const guide = mk("path", { class: "dash nf" }, g);
  const caseS = solid(g), zip = mk("path", { class: "nf lo" }, g);
  const wheels = [mk("circle", { r: 1.8, class: "dot off" }, g), mk("circle", { r: 1.8, class: "dot off" }, g)];
  const grip = solid(g), strap = mk("path", { class: "nf" }, g);
  const body = solid(g), face = mk("path", { class: "nf lo" }, g), bar = solid(g);
  const [cr, ci] = rings(0, 0, W, D, 5, 2), [gr, gi] = rings(15, 7, 29, 11, 2, 0.7);
  const [br, bi] = rings(15, 5, 29, 13, 4, 1.4), [hr, hi] = rings(11, 7, 33, 11, 2, 0.7);

  let last = NaN;
  function draw(L) {
    if (Math.abs(L - last) < 0.01) return;
    last = L;
    const top = L + H;
    guide.setAttribute("d", [[0, D], [W, D], [W, 0]].map(([x, y]) => seg(P(x, y, 0), P(x, y, L))).join(""));
    put(caseS, prism(P, front, cr, ci, L, top));
    zip.setAttribute("d", open([P(W * 0.5, D, L + 5), P(W * 0.5, D, top - 5)]));
    wheels[0].setAttribute("cx", P(4, D, L)[0]); wheels[0].setAttribute("cy", P(4, D, L)[1]);
    wheels[1].setAttribute("cx", P(W, D - 4, L)[0]); wheels[1].setAttribute("cy", P(W, D - 4, L)[1]);
    put(grip, prism(P, front, gr, gi, top, top + 5));
    strap.setAttribute("d", seg(P(22, 9, top + 5), P(22, 9, top + 16)) + seg(P(22, 9, top + 40), P(22, 9, top + 46)));
    put(body, prism(P, front, br, bi, top + 16, top + 40));
    face.setAttribute("d", poly([P(18, 13, top + 30), P(26, 13, top + 30), P(26, 13, top + 36), P(18, 13, top + 36)]));
    put(bar, prism(P, front, hr, hi, top + 46, top + 50));
  }

  let on = false;
  const lift = spring(REST);
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); show(); return m; });
  bag.add(B.unregister);


  function show() {
    const kg = 23.4 * clamp(lift.x / 4, 0, 1);
    read.textContent = on ? kg.toFixed(1) + " kg" : "rest";
  }
  function mark(a) {
    body.sil.classList.toggle("hi", !a);
    caseS.sil.classList.toggle("hi", a);
  }
  mark(false); show();
  bag.add(pointer(stage, {
    move: ([, sy]) => { on = true; mark(true); lift.t = clamp((290 - sy) / 180, 0, 1) * 34 * reach; B.wake(); },
    leave: () => { on = false; mark(false); lift.t = REST; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "bellcart",
  means: "A hand luggage scale: raise the pointer and the scale lifts the suitcase off the floor, reading its weight.",
  rules: [3, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[200, 143], [200, 60], [200, 250], null],
  mount,
});
