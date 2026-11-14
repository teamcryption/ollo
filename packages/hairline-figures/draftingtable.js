/**
 * Drafting table: a broad drawing board on two legs with splayed feet, a
 * straightedge resting across it. The pointer sets the tilt: toward the back
 * the board stands up steep, toward the front it lies nearly flat, hinged on
 * its front edge. At rest the board leans at a working angle, the straightedge
 * bright. The slider is the resting tilt.
 *
 * The pattern: one continuous value from a fixed ground plane (spring).
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, rrect, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 46, H = 40, YF = 42, T = 2.2, AMIN = 6, AMAX = 64;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restA = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-4, -6, 0], [W + 4, YF + 8, 0], [0, YF - D * Math.cos(rad(AMAX)), H + D * Math.sin(rad(AMAX)) + 3], [W, YF - D, H + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the stand: a foot rail and a post at each end, a stretcher between
  const legs = mk("g", {}, g);
  for (const x of [8, W - 8]) {
    const foot = solid(legs);
    const [fr, fi] = rings(x - 2, YF - 22, x + 2, YF + 6, 1.6, 0.6);
    put(foot, prism(P, front, fr, fi, 0, 3));
  }
  const stretch = solid(legs);
  const [sr, si] = rings(8, YF - 2.5, W - 8, YF + 0.5, 1.2, 0.5);
  put(stretch, prism(P, front, sr, si, 12, 15));
  for (const x of [8, W - 8]) {
    const post = solid(legs);
    const [pr, pi] = rings(x - 2, YF - 3, x + 2, YF + 1, 1.6, 0.6);
    put(post, prism(P, front, pr, pi, 3, H));
  }

  // the board: a rounded slab hinged on its front edge, a straightedge across it
  const boardG = mk("g", {}, g);
  const bSil = mk("path", { class: "sil" }, boardG), bCr = mk("path", { class: "nf lo" }, boardG), bEdge = mk("path", { class: "nf lo" }, boardG);
  const ruleG = mk("g", {}, g);
  const rSil = mk("path", { class: "sil hi" }, ruleG), rCr = mk("path", { class: "nf lo" }, ruleG);
  const ring = rrect(0, 0, W, D, 3, 4), inner = rrect(1.6, 1.6, W - 1.6, D - 1.6, 1.6, 4);
  const rRing = rrect(4, 15, W - 4, 19, 1, 3);

  // u along x, d back from the front edge, t up the board's normal
  function at(u, d, t, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return P(u, YF - d * c + t * s, H + d * s + t * c);
  }
  const map = (r, t, a) => r.map((q) => at(q.u, q.v, t, a));

  const ang = spring(restA);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg);
    bSil.setAttribute("d", poly(hull(map(ring, 0, a).concat(map(ring, T, a)))));
    bCr.setAttribute("d", poly(map(inner, T, a)));
    bEdge.setAttribute("d", seg(at(1, 0, 1.1, a), at(W - 1, 0, 1.1, a)));
    rSil.setAttribute("d", poly(hull(map(rRing, T, a).concat(map(rRing, T + 1.4, a)))));
    rCr.setAttribute("d", open(map(rRing, T + 1.4, a).slice(0, 8)));
  }

  const B = register(stage, (dt) => {
    const m = stepS(ang, dt);
    draw(ang.x);
    return m;
  });
  bag.add(B.unregister);

  let on = false;
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -14 || x > W + 14 || y < -30 || y > YF + 16) return leave();
    const deg = clamp(lerpY(y), AMIN, AMAX);
    ang.t = deg;
    if (!on) { on = true; bSil.classList.add("hi"); rSil.classList.remove("hi"); }
    read.textContent = Math.round(deg) + "°";
    B.wake();
  }
  function lerpY(y) { return AMAX + ((y + 30) / (YF + 16 + 30)) * (AMIN - AMAX); }
  function leave() {
    ang.t = restA;
    if (on) { on = false; bSil.classList.remove("hi"); rSil.classList.add("hi"); }
    read.textContent = "rest";
    B.wake();
  }
  draw(restA);
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restA = v; if (!on) { ang.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "draftingtable",
  means: "A drafting table: the board tilts on its front hinge with the pointer, steep toward the back, nearly flat toward the front.",
  rules: [1, 3, 5, 8],
  range: [12, 28, 44],
  tour: [[251, 206], [168, 226], [142, 275], null],
  mount,
});
