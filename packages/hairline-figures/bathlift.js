/**
 * Bath lift: a base plate on suction feet, a scissor frame, and a seat with
 * side flaps and a reclined backrest. The pointer's place across the lift
 * sets the seat's height: it rides up or down on a spring and lights. At rest
 * the seat sits part-way up and the backrest is the bright mark.
 */
const {
  Cam, clamp, fit, facing, hull, lerp, poly, prism, proj, rad, rings, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const H0 = 8, H1 = 46, REST = 24, BL = 44, BA = 72, T = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-14, -14, 0], [44, 50, 0], [44, -14, 0], [-14, 50, H1 + 50], [44, -14, H1 + 4], [-14, -14, H1 + 50]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // suction feet and base plate
  const feet = [[2, 2], [36, 2], [2, 34], [36, 34]];
  for (const [fx, fy] of feet) {
    const [r, i] = rings(fx - 3, fy - 3, fx + 3, fy + 3, 3, 1);
    put(solid(g), prism(P, front, r, i, 0, 2));
  }
  const [br, bi] = rings(0, 0, 38, 36, 5, 1.6);
  put(solid(g), prism(P, front, br, bi, 2, 5));
  const back = solid(g);
  const sc = mk("path", { class: "nf" }, g);
  // seat: centre plate between two flaps that rest on the bath's rims
  const flapA = solid(g), seat = solid(g), flapB = solid(g);
  const [sr, si] = rings(-4, 1, 42, 35, 6, 2);
  const [ar, ai] = rings(4, -14, 38, 0, 5, 1.6), [cr, ci] = rings(4, 36, 38, 50, 5, 1.6);
  const bO = rrect(0, 2, BL, 34, 6, 4), bI = rrect(1.8, 3.8, BL - 1.8, 32.2, 4.2, 4);
  const at = (ring, h, t) => ring.map((q) => P(-2 - q.u * Math.cos(rad(BA)) + t * Math.sin(rad(BA)), q.v, h + T + q.u * Math.sin(rad(BA)) + t * Math.cos(rad(BA))));

  const hs = spring(REST);
  let last = NaN;
  function draw() {
    const h = Math.round(hs.x * 10) / 10;
    if (h === last) return;
    last = h;
    back.sil.setAttribute("d", poly(hull(at(bO, h, 0).concat(at(bO, h, T)))));
    back.cr.setAttribute("d", poly(at(bI, h, T)));
    let d = "";
    for (const y of [4, 32]) d += seg(P(4, y, 5), P(34, y, h)) + seg(P(34, y, 5), P(4, y, h));
    sc.setAttribute("d", d);
    put(flapA, prism(P, front, ar, ai, h, h + 2));
    put(seat, prism(P, front, sr, si, h, h + T));
    put(flapB, prism(P, front, cr, ci, h, h + 2));
  }
  const B = register(stage, (dt) => { const m = stepS(hs, dt); draw(); return m; });
  bag.add(B.unregister);

  const sx0 = P(0, 40, 0)[0], sx1 = P(38, -4, 0)[0];
  let on = null;
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, REST + T);
    if (!(wx > -16 && wx < 50 && wy > -18 && wy < 54)) return leave();
    const t = clamp((sx - sx0) / (sx1 - sx0), 0, 1);
    hs.t = lerp(REST, lerp(H1, H0, t), reach / 100);
    if (on !== true) { on = true; seat.sil.classList.add("hi"); back.sil.classList.remove("hi"); }
    read.textContent = Math.round(hs.t) + "cm";
    B.wake();
  }
  function leave() {
    hs.t = REST;
    if (on !== false) { on = false; seat.sil.classList.remove("hi"); back.sil.classList.add("hi"); }
    read.textContent = "rest";
    B.wake();
  }
  leave();
  draw();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "bathlift",
  means: "A bath lift on its suction feet: the pointer's place across the lift raises or lowers the seat on its scissor frame.",
  rules: [1, 3, 5, 8],
  range: [20, 100, 100],
  tour: [[139, 223], [209, 218], [272, 216], null],
  mount,
});
