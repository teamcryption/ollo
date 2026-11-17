/**
 * Thumb drum: a steel tongue drum resting in a low ring cradle, its top cut
 * into tongues. The pointer over the drum tips it up toward the player on
 * the cradle, showing its tongues full face. At rest one tongue is bright;
 * when the pointer plays, the drum's rim is. The slider is how far it tips.
 *
 * The pattern: one part turning about a hinge (tilt).
 */
const { Cam, circ, fit, facing, hull, open, poly, prism, proj, rad, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const R = 46, H = 30, CR = 30, TOP = 11, BOT = -13, REST = 8, TONGUES = 6, FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [-30, -30, H + 52], [30, 30, H + 40]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(CR, 48), circ(CR - 3, 48), 0, 6));
  for (const t of [0, 1, 2]) {
    const a = rad(90 + t * 120), x = CR * Math.cos(a), y = CR * Math.sin(a);
    put(solid(g), prism(P, front, circ(3, 12).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), circ(2, 12).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), 6, H - 8));
  }
  const body = mk("path", { class: "sil" }, g), plate = mk("path", { class: "nf lo" }, g), seam = mk("path", { class: "nf lo" }, g);
  const tongues = Array.from({ length: TONGUES }, () => mk("path", { class: "nf" }, g));
  const hole = mk("path", { class: "nf" }, g);

  const ax = [Math.SQRT1_2, -Math.SQRT1_2, 0];
  let W = (p) => p;
  function setRot(deg) {
    const f = rad(-deg), c = Math.cos(f), s = Math.sin(f);
    W = ([x, y, z]) => {
      const d = ax[0] * x + ax[1] * y, cx = ax[1] * z, cy = -ax[0] * z, cz = ax[0] * y - ax[1] * x;
      const q = [x * c + cx * s + ax[0] * d * (1 - c), y * c + cy * s + ax[1] * d * (1 - c), z * c + cz * s];
      return P(q[0], q[1], q[2] + H);
    };
  }
  const ring = (r, z, n = 48) => circ(r, n).map((q) => W([q.u, q.v, z]));
  const tong = (k) => {
    const a0 = rad(k * (360 / TONGUES) + 15), w = rad(14 + (k % 3) * 4), r0 = 9, r1 = 26 - (k % 2) * 5, pts = [];
    for (let i = 0; i <= 8; i++) { const a = a0 - w / 2 + (w * i) / 8; pts.push([r1 * Math.cos(a), r1 * Math.sin(a)]); }
    pts.push([r0 * Math.cos(a0 + w / 2), r0 * Math.sin(a0 + w / 2)], [r0 * Math.cos(a0 - w / 2), r0 * Math.sin(a0 - w / 2)], pts[0]);
    return open(pts.slice(0, 9).concat([[pts[9][0], pts[9][1]]]).map(([x, y]) => W([x, y, TOP])).concat([W([r0 * Math.cos(a0 - w / 2), r0 * Math.sin(a0 - w / 2), TOP]), W([pts[0][0], pts[0][1], TOP])]));
  };

  const tw = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    setRot(deg);
    const pts = [];
    for (let i = 0; i <= 6; i++) { const t = i / 6; pts.push(...ring(CR + (R - CR) * Math.sin(t * Math.PI / 2), TOP * (1 - t), 32), ...ring(CR - 6 + (R - CR + 6) * Math.sin(t * Math.PI / 2), BOT * (1 - t), 32)); }
    body.setAttribute("d", poly(hull(pts)));
    plate.setAttribute("d", poly(ring(CR, TOP)));
    seam.setAttribute("d", poly(ring(R - 1, 0.4)));
    tongues.forEach((el, k) => el.setAttribute("d", tong(k)));
    hole.setAttribute("d", poly(ring(4, TOP, 20)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, H);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? REST + 30 * amp : REST, performance.now(), 0);
    body.classList.toggle("hi", on);
    tongues.forEach((el, k) => el.classList.toggle("hi", !on && k === FAV));
    read.textContent = on ? "tip" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.hypot(sx - mid[0], (sy - mid[1]) * 1.5) < 110;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "zither",
  means: "A steel tongue drum in a ring cradle: over the drum, it tips up toward the player to show its tongues.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[200, 155], [166, 170], [234, 162], null],
  mount,
});
