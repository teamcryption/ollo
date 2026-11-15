/**
 * Robot arm: a turntable base, a shoulder, an upper arm and a forearm on
 * round joints, a two-finger gripper at the wrist. The pointer is the part
 * to pick: the base turns to face it and the arm reaches out or folds in to
 * meet it, and the gripper goes bright. At rest the arm is half out and turned
 * aside, the shoulder joint the mark. The slider is how quickly it follows.
 */
const {
  Cam, circ, clamp, facing, fit, hull, mk, poly, prism, proj, rings, seg, unproj,
  spring, stepS, disposer, pointer, put, register, solid,
} = HL;

const ZS = 22, L1 = 42, L2 = 40, A0 = -12, A1 = 120, R0 = 26, R1 = 66, d2r = Math.PI / 180;
const REST = { yaw: 14, reach: 56 };
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.15);
  const ext = [[-20, -20, 0], [20, 20, 0]];
  for (let k = 0; k <= 6; k++) { const a = (A0 + (A1 - A0) * k / 6) * d2r; ext.push([R1 * Math.cos(a), R1 * Math.sin(a), 0], [30 * Math.cos(a), 30 * Math.sin(a), ZS + 44]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [BR, BI] = rings(-18, -18, 18, 18, 7, 1.6);
  put(solid(g), prism(P, front, BR, BI, 0, 4));
  put(solid(g), prism(P, front, circ(11, 40), circ(9.6, 40), 4, 9));
  const tower = solid(g), shoulder = solid(g), upper = solid(g), elbow = solid(g), fore = solid(g), wrist = solid(g);
  const fingers = mk("path", { class: "nf sil", d: "" }, g);
  const opt = { k: 100 * value, c: 18 * Math.sqrt(value) };
  const yaw = spring(REST.yaw * d2r, opt), reach = spring(REST.reach, opt);
  const rod = (a, b, r) => poly(hull([...P_ring(a, r), ...P_ring(b, r)]));
  const P_ring = (p, r) => [-r, r].flatMap((dz) => circ(r, 16).map((q) => P(p[0] + q.u, p[1] + q.v, p[2] + dz)));
  let dy = NaN, dr = NaN;
  function draw() {
    if (Math.abs(yaw.x - dy) < 1e-4 && Math.abs(reach.x - dr) < 1e-3) return;
    dy = yaw.x; dr = reach.x;
    const c = Math.cos(dy), s = Math.sin(dy), R = clamp(dr, R0, R1);
    // two-link reach in the arm's plane: the wrist sits at R out, 8 above the floor
    const tx = R, tz = 10 - ZS, D = Math.min(L1 + L2 - 0.5, Math.hypot(tx, tz));
    const a1 = Math.atan2(tz, tx) + Math.acos((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D));
    const ex = L1 * Math.cos(a1), ez = ZS + L1 * Math.sin(a1);
    const W = (r, z) => [r * c, r * s, z];
    const sh = W(0, ZS), el = W(ex, ez), wr = W(tx, 10);
    put(tower, prism(P, front, circ(6, 32), null, 9, ZS));
    put(shoulder, prism(P, front, circ(7.5, 32), circ(6.4, 32), ZS - 3, ZS + 3));
    upper.sil.setAttribute("d", rod(sh, el, 4)); upper.cr.setAttribute("d", "");
    put(elbow, prism(P, front, disc(el[0], el[1], 5.5), disc(el[0], el[1], 4.6), ez - 3, ez + 3));
    fore.sil.setAttribute("d", rod(el, wr, 3)); fore.cr.setAttribute("d", "");
    put(wrist, prism(P, front, disc(wr[0], wr[1], 4.2), null, 7, 12));
    const px = -s * 3.6, py = c * 3.6;
    fingers.setAttribute("d", seg(P(wr[0] + px, wr[1] + py, 7), P(wr[0] + px * 0.6, wr[1] + py * 0.6, 1)) + seg(P(wr[0] - px, wr[1] - py, 7), P(wr[0] - px * 0.6, wr[1] - py * 0.6, 1)));
  }
  const B = register(stage, (dt) => { const m = stepS(yaw, dt) | stepS(reach, dt); draw(); return !!m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    yaw.t = (over ? over.a : REST.yaw) * d2r;
    reach.t = over ? over.r : REST.reach;
    wrist.sil.classList.toggle("hi", !!over);
    shoulder.sil.classList.toggle("hi", !over);
    read.textContent = over ? "r " + Math.round(over.r) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r > R1 + 40 || r < 8 ? null : { a: clamp(Math.atan2(y, x) / d2r, A0, A1), r: clamp(r, R0, R1) };
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return { set: (v) => { for (const sp of [yaw, reach]) { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); } }, destroy: bag.dispose };
}

hairline({
  name: "robotarm2",
  means: "A robot arm on a turntable: it turns and reaches out or folds in to meet the pointer, and the gripper goes bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[146, 254], [383, 252], [35, 248], null],
  mount,
});
