/**
 * Catapult: a toy catapult on a low sled, two posts holding an axle and a
 * long throwing arm with a cup at its end. At rest the arm lies cocked
 * back over the sled, bright. The pointer over the catapult releases it:
 * the arm swings up over the axle until it stands near upright. The
 * slider is how far the arm swings.
 *
 * The pattern: one part turning about an axle (swing).
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 64, PX = 22, PZ = 24, Y0 = 13, Y1 = 21, REST = 12;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-6, -2, 0], [86, 36, 0], [86, -2, 0], [-6, 36, 0], [PX - 10, 17, PZ + L + 8], [PX + L, 17, PZ + 10]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, 0, 80, 34, 5, 1.6);
  put(solid(g), prism(P, front, sr, si, 0, 6));
  // wheels' hint: two dim axles on the sled's near face
  mk("path", { d: poly(rings(8, 30, 20, 34, 2, 0.6)[0].map((q) => P(q.u, q.v, 2))), class: "nf lo" }, g);
  const postFar = solid(g);
  put(postFar, prism(P, front, ...rings(PX - 4, 4, PX + 4, 9, 1.5, 0.8), 6, PZ + 4));
  const arm = solid(g), cup = mk("path", { class: "nf" }, arm.g);
  const postNear = solid(g);
  put(postNear, prism(P, front, ...rings(PX - 4, 25, PX + 4, 30, 1.5, 0.8), 6, PZ + 4));
  mk("path", { d: poly(rings(PX - 2, 26, PX + 2, 29, 1, 0.5)[0].map((q) => P(q.u, q.v, PZ + 4))), class: "nf lo" }, postNear.g);

  const ang = tween(180 - REST);
  let last = NaN;
  function pts(a, s0, s1, t0, t1, y0, y1) {
    const r = (a * Math.PI) / 180, d = [Math.cos(r), Math.sin(r)], n = [-Math.sin(r), Math.cos(r)], out = [];
    for (const s of [s0, s1]) for (const t of [t0, t1]) for (const y of [y0, y1])
      out.push(P(PX + s * d[0] + t * n[0], y, PZ + s * d[1] + t * n[1]));
    return out;
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    // the arm points toward +x at a = 0 and swings up and back over the axle
    const b = 180 - a;
    arm.sil.setAttribute("d", poly(hull(pts(b, -8, L, -1.5, 1.5, Y0, Y1))));
    arm.cr.setAttribute("d", poly(hull(pts(b, -6, L - 2, 1.5, 1.5, Y0 + 1, Y1 - 1))));
    cup.setAttribute("d", poly(hull(pts(b, L - 12, L, 1.5, 7, Y0 - 2, Y1 + 2))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a ? 180 - swing : 180 - REST, performance.now(), 0);
    arm.sil.classList.add("hi");
    read.textContent = a ? "fire" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x > -20 && x < 100 && y > -30 && y < 50 ? 1 : 0;
  }
  setActive(0);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = clamp(v, 60, 110); act = -2; }, destroy: bag.dispose };
}

hairline({
  name: "catapult",
  means: "A toy catapult cocked on its sled: the pointer releases it, and the long arm swings up over the axle with its cup.",
  rules: [1, 3, 5, 6],
  range: [60, 95, 110],
  tour: [[241, 202], [215, 215], [250, 195], null],
  mount,
});
