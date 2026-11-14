/**
 * Dental chair: a padded seat on a pedestal, its backrest hinged at the seat,
 * an overhead lamp on a pole behind. The pointer's place across the chair
 * sets the recline: the backrest tilts back on a spring and lights. At rest
 * the back stands half-reclined and the lamp head is the bright mark.
 */
const {
  Cam, clamp, fit, facing, hull, lerp, poly, prism, proj, rad, rings, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const SZ = 30, L = 46, T = 6, REST = 58, A0 = 18, A1 = 80;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-46, 0, 0], [70, 26, 0], [-46, 26, SZ + 50], [40, -18, 100], [70, -18, 0], [-10, 2, SZ + L]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [fr, fi] = rings(-6, -2, 62, 28, 6, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 3));
  // lamp pole, behind the chair
  const [pr, pi] = rings(36, -20, 42, -14, 3, 1);
  put(solid(g), prism(P, front, pr, pi, 0, 96));
  const back = solid(g);
  const [dr, di] = rings(16, 6, 36, 20, 5, 1.5);
  put(solid(g), prism(P, front, dr, di, 3, SZ - 4));
  const [sr, si] = rings(0, 2, 50, 24, 5, 1.6);
  put(solid(g), prism(P, front, sr, si, SZ - 4, SZ));
  // leg rest sloping down from the seat's end
  const legO = rrect(0, 2, 24, 24, 5, 4), legI = rrect(1.6, 3.6, 22.4, 22.4, 3.4, 4);
  const legAt = (ring, t) => ring.map((q) => P(50 + q.u * Math.cos(rad(32)) , q.v, SZ - q.u * Math.sin(rad(32)) - 4 + t));
  const leg = solid(g);
  leg.sil.setAttribute("d", poly(hull(legAt(legO, 0).concat(legAt(legO, 4)))));
  leg.cr.setAttribute("d", poly(legAt(legI, 4)));
  // arm and lamp head over the seat
  mk("path", { d: seg(P(39, -17, 96), P(22, 8, 86)), class: "nf" }, g);
  const [hr, hi] = rings(14, 2, 30, 14, 5, 1.5);
  const head = solid(g);
  put(head, prism(P, front, hr, hi, 80, 86));
  head.sil.classList.add("hi");

  const bO = rrect(0, 2, L, 24, 6, 4), bI = rrect(1.8, 3.8, L - 1.8, 22.2, 4.2, 4);
  const at = (ring, a, t) => ring.map((q) => P(-q.u * Math.cos(a) + t * Math.sin(a), q.v, SZ + q.u * Math.sin(a) + t * Math.cos(a)));
  const ang = spring(REST);
  let last = NaN;
  function draw() {
    const a = r2a(ang.x);
    if (a === last) return;
    last = a;
    back.sil.setAttribute("d", poly(hull(at(bO, rad(a), 0).concat(at(bO, rad(a), T)))));
    back.cr.setAttribute("d", poly(at(bI, rad(a), T)));
  }
  const r2a = (v) => Math.round(v * 10) / 10;
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);

  const sx0 = P(-30, 12, 0)[0], sx1 = P(60, 12, 0)[0];
  let on = null;
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    const inside = wx > -50 && wx < 75 && wy > -25 && wy < 35;
    if (!inside) return leave();
    const t = clamp((sx - sx0) / (sx1 - sx0), 0, 1);
    ang.t = lerp(REST, lerp(A1, A0, t), reach / 100);
    if (on !== true) { on = true; back.sil.classList.add("hi"); head.sil.classList.remove("hi"); }
    read.textContent = Math.round(ang.t) + "°";
    B.wake();
  }
  function leave() {
    ang.t = REST;
    if (on !== false) { on = false; back.sil.classList.remove("hi"); head.sil.classList.add("hi"); }
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
  name: "dentalchair",
  means: "A dental chair under its lamp: the pointer's place across the chair reclines the backrest on its hinge.",
  rules: [1, 3, 5, 8],
  range: [20, 100, 100],
  tour: [[124, 201], [170, 223], [253, 265], null],
  mount,
});
