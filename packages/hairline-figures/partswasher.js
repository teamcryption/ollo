/**
 * Parts washer: a solvent tub sitting on its drum, its lid hinged along the
 * back edge. The pointer over the tub lifts the lid open on a spring, further
 * the nearer it comes to the front; at rest the lid stands ajar, bright.
 * The slider is how far the lid can open.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, spring, stepS, unproj, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 90, D = 60, DR = 30, DH = 46, TH = 22, LT = 3, REST = 16;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.85);
  const Z = DH + TH;
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, Z + D], [W, 0, Z + D], [0, D, Z + 4]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const cx = W / 2, cy = D / 2;
  put(solid(g), prism(P, front, disc(cx, cy, DR), disc(cx, cy, DR - 2), 0, DH));
  mk("path", { d: poly(ringAt(P, disc(cx, cy, DR, 40), DH * 0.5)).replace(/Z$/, ""), class: "nf lo" }, g);
  const [br, bi] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, br, bi, DH, Z));
  mk("path", { d: poly(ringAt(P, rrect(6, 6, W - 6, D - 6, 4, 6), Z)), class: "nf lo" }, g);
  const lidR = rrect(-1, 0, W + 1, D + 2, 5, 6), lidI = rrect(4, 5, W - 4, D - 3, 3, 6);
  const lid = mk("path", { class: "sil" }, g), lidC = mk("path", { class: "nf lo" }, g), knob = mk("path", { class: "nf" }, g);
  const at = (q, a, off) => { const c = Math.cos(a), s = Math.sin(a); return P(q.u, q.v * c + off * s, Z + q.v * s - off * c + off); };
  const ang = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180;
    lid.setAttribute("d", poly(hull(lidR.map((q) => at(q, a, 0)).concat(lidR.map((q) => at(q, a, LT))))));
    lidC.setAttribute("d", poly(lidI.map((q) => at(q, a, LT))));
    const k = [{ u: cx - 8, v: D - 6 }, { u: cx + 8, v: D - 6 }];
    knob.setAttribute("d", poly(hull(k.map((q) => at(q, a, LT)).concat(k.map((q) => at(q, a, LT + 4))))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  lid.classList.add("hi");

  function move([sx, sy]) {
    let best = null;
    for (const z of [Z, DH * 0.5]) { const [x, y] = unproj(C, sx, sy, z); if (x > -4 && x < W + 4 && y > -4 && y < D + 4) { best = y; break; } }
    if (best === null) return leave();
    const t = clamp(best / D, 0, 1);
    ang.t = REST + (maxA - REST) * (0.45 + 0.55 * t);
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
  name: "partswasher",
  means: "A parts washer on its drum: the pointer over the tub lifts the hinged lid, wider the nearer the front.",
  rules: [1, 3, 5, 8],
  range: [40, 85, 95],
  tour: [[174, 179], [220, 215], [180, 140], null],
  mount,
});
