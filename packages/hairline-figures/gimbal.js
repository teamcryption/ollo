/**
 * Phone gimbal: a handle on a small foot, a motor head, an elbow arm and a
 * phone held in its clamp. The pointer over the gimbal swings the arm round
 * the handle, carrying the phone with it. At rest the phone faces a little
 * off-axis, bright. The slider is how far the arm swings.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, spring, stepS, rad, disposer, mk, pointer, put, register, solid } = HL;

const HR = 7, HH = 50, R = 22, ZA = HH + 6, PW = 58, PH = 30, PT = 3.2;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-14, -14, 0], [30, 30, 0], [-36, -36, ZA + 42], [36, 36, ZA + 42]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-14, -14, 14, 14, 14, 1.6);
  put(solid(g), prism(P, front, fr, fi, 0, 3));
  const armB = mk("path", { class: "sil" }, g);
  const hd = solid(g);
  put(hd, prism(P, front, disc(0, 0, HR, 28), disc(0, 0, HR - 1.4, 28), 3, HH));
  const [mr, mi] = rings(-9, -9, 9, 9, 9, 1.4);
  put(solid(g), prism(P, front, mr, mi, HH, HH + 8));
  mk("path", { d: poly(ringAt(P, disc(4.2, 4.2, 1.6, 12), 30)), class: "dot m" }, g);
  const arm = mk("path", { class: "sil" }, g);
  const post = mk("path", { class: "sil" }, g);
  const phone = mk("path", { class: "sil hi" }, g);
  const lens = mk("path", { class: "lo" }, g);

  const REST = 25, ang = spring(REST);
  let last = null;
  function draw(a) {
    if (a === last) return;
    last = a;
    const t = rad(a), ux = Math.cos(t), uy = Math.sin(t), tx = -uy, ty = ux;
    const cyl = (x0, y0, x1, y1, z, r) => hull(ringAt(P, disc(x0, y0, r, 12), z - r).concat(ringAt(P, disc(x0, y0, r, 12), z + r), ringAt(P, disc(x1, y1, r, 12), z - r), ringAt(P, disc(x1, y1, r, 12), z + r)));
    const behind = ux + uy < 0;
    const bar = poly(cyl(0, 0, R * ux, R * uy, ZA, 2.6));
    armB.setAttribute("d", behind ? bar : "");
    arm.setAttribute("d", behind ? "" : bar);
    post.setAttribute("d", poly(hull(ringAt(P, disc(R * ux, R * uy, 2.6, 12), ZA).concat(ringAt(P, disc(R * ux, R * uy, 2.6, 12), ZA + 10)))));
    const cx = (R + 2) * ux, cy = (R + 2) * uy, z0 = ZA + 10, pts = [];
    for (const s of [-1, 1]) for (const h of [0, PH]) for (const d of [0, PT]) pts.push(P(cx + s * PW / 2 * tx + d * ux, cy + s * PW / 2 * ty + d * uy, z0 + h));
    phone.setAttribute("d", poly(hull(pts)));
    const face = front2(ux, uy) ? PT : 0, lx = cx + (PW / 2 - 7) * tx + face * ux, ly = cy + (PW / 2 - 7) * ty + face * uy;
    lens.setAttribute("d", poly([P(lx, ly, z0 + PH - 4), P(lx + 3 * tx, ly + 3 * ty, z0 + PH - 4), P(lx + 3 * tx, ly + 3 * ty, z0 + PH - 9), P(lx, ly, z0 + PH - 9)]));
  }
  const front2 = (ux, uy) => ux + uy > 0;
  draw(REST);
  const B = register(stage, (dt) => { const mv = stepS(ang, dt); draw(ang.x); return mv; });
  bag.add(B.unregister);

  let on = null;
  const tgt = () => REST + 40 + 120 * reach;
  function setOn(v) {
    if (v === on) return;
    on = v;
    ang.t = v ? tgt() : REST;
    read.textContent = v ? "pan" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    for (const z of [0, HH, ZA + 25]) { const [x, y] = unproj(C, sx, sy, z); if (Math.hypot(x, y) < 34) return true; }
    return false;
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { ang.t = tgt(); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "gimbal",
  means: "A phone gimbal: the pointer swings its elbow arm round the handle, carrying the phone; the slider sets how far it pans.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.75, 1],
  tour: [[219, 128], [200, 205], [182, 150], null],
  mount,
});
