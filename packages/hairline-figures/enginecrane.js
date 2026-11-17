/**
 * Engine stand: a post on a T foot holds an engine block out on its mount
 * head, free to roll about the long axis. The pointer across the block rolls
 * it over on a spring, one way or the other by where it stands; at rest the
 * block sits tipped, its pulley bright. The slider is the roll's reach.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, rrect, clamp, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 52, BX0 = 10, BX1 = 70, HW = 20, HH = 17, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-26, -34, 0], [-26, 34, 0], [BX1 + 6, -28, H + 28], [BX1 + 6, 28, H - 28], [BX1 + 6, 0, H + 28]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const roll = (q, a, x) => { const c = Math.cos(a), s = Math.sin(a); return P(x, q.u * c - q.v * s, H + q.u * s + q.v * c); };
  const [fr, fi] = rings(-30, -34, -18, 34, 5, 1.5);
  put(solid(g), prism(P, front, fr, fi, 0, 6));
  const [lr, li] = rings(-28, -6, 10, 6, 4, 1.5);
  put(solid(g), prism(P, front, lr, li, 0, 5));
  const [pr0, pi0] = rings(-27, -4, -19, 4, 3, 1.2);
  put(solid(g), prism(P, front, pr0, pi0, 6, H + 6));
  const [ar, ai] = rings(-24, -3, BX0, 3, 2, 1);
  put(solid(g), prism(P, front, ar, ai, H - 3, H + 3));
  const blk = rrect(-HW, -HH, HW, HH, 6, 6), inner = rrect(-HW + 3, -HH + 3, HW - 3, HH - 3, 4, 6);
  const head = circ(10, 24);
  mk("path", { d: poly(hull(head.map((q) => P(BX0 - 4, q.u, H + q.v)).concat(head.map((q) => P(BX0, q.u, H + q.v))))), class: "sil" }, g);
  const body = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g), bank = mk("path", { class: "nf lo" }, g);
  const pul = mk("path", { class: "sil hi" }, g), hub = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180;
    body.setAttribute("d", poly(hull(blk.map((q) => roll(q, a, BX0)).concat(blk.map((q) => roll(q, a, BX1))))));
    face.setAttribute("d", poly(inner.map((q) => roll(q, a, BX1))));
    bank.setAttribute("d", poly([{ u: -HW, v: HH * 0.35 }, { u: HW, v: HH * 0.35 }].map((q) => roll(q, a, BX1)).concat([{ u: HW, v: HH * 0.35 }, { u: -HW, v: HH * 0.35 }].map((q) => roll(q, a, BX0)))));
    const pc = circ(8, 24).map((q) => ({ u: q.u, v: q.v - 6 }));
    pul.setAttribute("d", poly(hull(pc.map((q) => roll(q, a, BX1)).concat(pc.map((q) => roll(q, a, BX1 + 5))))));
    hub.setAttribute("d", poly(circ(2.5, 12).map((q) => roll({ u: q.u, v: q.v - 6 }, a, BX1 + 5))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    if (x < BX0 - 10 || x > BX1 + 14 || Math.abs(y) > 34) return leave();
    const t = clamp(y / 30, -1, 1);
    ang.t = t * maxA;
    read.textContent = Math.round(ang.t) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "enginecrane",
  means: "An engine stand: the pointer across the block rolls it over on its mount head, one way or the other.",
  rules: [1, 3, 5, 8],
  range: [30, 80, 90],
  tour: [[265, 122], [225, 141], [189, 160], null],
  mount,
});
