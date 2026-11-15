/**
 * Ticket gate: a ticket barrier, two cabinets either side of a lane, a glass
 * paddle swung out from each into the lane, a card reader on one. As the
 * pointer comes up the lane the paddles swing open, wider the nearer it is.
 * At rest they stand a little ajar, bright. The slider is how far they open.
 */
const {
  Cam, circ, clamp, fillet, fit, facing, hull, lerp, poly, prism, proj, rad, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CL = 64, CW = 12, AW = 44, CH = 34, HX = 34, PL = 21, PZ0 = 10, PZ1 = 48, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  const Y1 = CW + AW + CW;
  fit(C, [[0, 0, 0], [CL, Y1, 0], [CL, 0, CH], [0, Y1, CH], [HX + PL, CW + 2, PZ1], [0, 0, PZ1]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ar, ai] = rings(0, 0, CL, CW, 4, 1.6);
  put(solid(g), prism(P, front, ar, ai, 0, CH));
  const reader = circ(5, 24).map((q) => ({ ...q, u: q.u + 16, v: q.v + CW / 2 }));
  mk("path", { d: poly(reader.map((q) => P(q.u, q.v, CH))), class: "nf" }, g);
  const pa = mk("path", { class: "sil" }, g), pb = mk("path", { class: "sil" }, g);
  const [br, bi] = rings(0, CW + AW, CL, Y1, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, CH));
  const ang = spring(REST);
  let last = NaN;

  const plate = (hy, dir, a) => {
    const s = Math.sin(rad(a)), c = Math.cos(rad(a)), q = (t) => {
      const ty = hy + dir * PL * c, tx = HX + PL * s + t;
      return [P(HX + t, hy, PZ0), P(tx, ty, PZ0 + 6), P(tx, ty, PZ1 - 6), P(HX + t, hy, PZ1)];
    };
    return poly(hull(fillet(q(0), [2, 5, 5, 2]).concat(fillet(q(1.5), [2, 5, 5, 2]))));
  };
  function draw(a) {
    const r = Math.round(a * 100) / 100;
    if (r === last) return;
    last = r;
    pa.setAttribute("d", plate(CW, 1, a));
    pb.setAttribute("d", plate(CW + AW, -1, a));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -50 || x > CL + 30 || y < -20 || y > Y1 + 20) return leave();
    const d = Math.hypot(x - HX, y - (CW + AW / 2));
    ang.t = lerp(REST, 15 + 75 * reach, clamp(1 - (d - 10) / 60, 0, 1));
    read.textContent = Math.round(ang.t) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  pa.classList.add("hi"); pb.classList.add("hi");
  draw(REST); leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "phrasebook",
  means: "A ticket barrier gate: its two glass paddles swing open as the pointer comes up the lane, wider the nearer it is.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[78, 155], [163, 197], [203, 218], null],
  mount,
});
