/**
 * Examination couch: a long padded top on four legs, its backrest hinged a
 * third of the way along. The pointer's place along the couch sets how far
 * the backrest is raised: it swings up on a spring and lights. At rest the
 * backrest is a little raised and the foot section is the bright mark.
 */
const {
  Cam, clamp, fit, facing, hull, lerp, poly, prism, proj, rad, rings, rrect, spring, stepS,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const Z = 31, HX = 40, L = 40, T = 6, REST = 8, A0 = 0, A1 = 80;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[0, 0, 0], [96, 30, 0], [96, 0, 0], [0, 30, 0], [HX - 10, 0, Z + L + 6], [HX - 10, 30, Z + L + 6], [0, 0, Z + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  for (const [lx, ly] of [[6, 4], [6, 26], [90, 4], [90, 26]]) {
    const [r, i] = rings(lx - 2.5, ly - 2.5, lx + 2.5, ly + 2.5, 2.5, 0.8);
    put(solid(g), prism(P, front, r, i, 0, Z - 3));
  }
  const [fr, fi] = rings(2, 1, 94, 29, 4, 1.4);
  put(solid(g), prism(P, front, fr, fi, Z - 3, Z));
  const back = solid(g);
  const [sr, si] = rings(HX + 1, 0, 96, 30, 6, 2);
  const seat = solid(g);
  put(seat, prism(P, front, sr, si, Z, Z + T));

  const bO = rrect(1, 0, L, 30, 6, 4), bI = rrect(3, 2, L - 2, 28, 4, 4);
  const at = (ring, a, t) => ring.map((q) => P(HX - q.u * Math.cos(a) + t * Math.sin(a), q.v, Z + q.u * Math.sin(a) + t * Math.cos(a)));
  const ang = spring(REST);
  let last = NaN;
  function draw() {
    const a = Math.round(ang.x * 10) / 10;
    if (a === last) return;
    last = a;
    back.sil.setAttribute("d", poly(hull(at(bO, rad(a), 0).concat(at(bO, rad(a), T)))));
    back.cr.setAttribute("d", poly(at(bI, rad(a), T)));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);

  const sx0 = P(0, 30, 0)[0], sx1 = P(96, 0, 0)[0];
  let on = null;
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, Z + T);
    if (!(wx > -12 && wx < 104 && wy > -10 && wy < 40)) return leave();
    const t = clamp((sx - sx0) / (sx1 - sx0), 0, 1);
    ang.t = lerp(REST, lerp(A1, A0, t), reach / 100);
    if (on !== true) { on = true; back.sil.classList.add("hi"); seat.sil.classList.remove("hi"); }
    read.textContent = Math.round(ang.t) + "°";
    B.wake();
  }
  function leave() {
    ang.t = REST;
    if (on !== false) { on = false; back.sil.classList.remove("hi"); seat.sil.classList.add("hi"); }
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
  name: "examcouch",
  means: "An examination couch on four legs: the pointer's place along the couch raises the backrest on its hinge.",
  rules: [1, 3, 5, 8],
  range: [20, 100, 100],
  tour: [[109, 135], [153, 133], [220, 167], null],
  mount,
});
