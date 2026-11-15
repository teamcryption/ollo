/**
 * Separating funnel: a pear-shaped funnel with a stopper, a tap on its stem
 * and two layers inside, held by a clamp on a retort stand over a beaker.
 * The pointer's height slides the clamp, and the funnel with it, up or down
 * the rod; leaving brings it back over the beaker. The funnel is the bright
 * mark. The slider is how far the clamp can travel.
 *
 * The pattern: one part following the pointer (slide).
 */
const {
  Cam, fit, facing, circ, clamp, hull, lerp, poly, prism, proj, ringAt, rings, spring, stepS, r2,
  disposer, mk, pointer, put, register, solid,
} = HL;

const FX = 28, RX = -14, H0 = 70, H1 = 112, TOPZ = 160;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const PEAR = [[38, 4], [32, 5], [27, 9], [20, 14], [12, 16.5], [4, 14], [-4, 9], [-12, 4], [-17, 2.4]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;
  const C = Cam(45, 0.5, 1.45);
  fit(C, [[-30, -28, 0], [64, 28, 0], [64, -28, 0], [-30, 28, 0], [RX, 0, TOPZ], [FX, 0, H1 + 44]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ba, bi] = rings(-30, -28, 64, 28, 6, 2);
  put(solid(g), prism(P, front, ba, bi, 0, 4));
  put(solid(g), prism(P, front, disc(RX, 0, 2.4, 16), disc(RX, 0, 1.6, 16), 4, TOPZ));
  const mv = mk("g", {}, g);
  const arm = solid(mv), boss = solid(mv), stem = solid(mv), tap = solid(mv), handle = solid(mv), body = solid(mv), plug = solid(mv);
  const layer = mk("path", { class: "nf lo" }, mv);
  // the beaker the funnel drains into, nearest the viewer
  const bk = solid(g);
  put(bk, prism(P, front, disc(FX, 0, 13, 32), disc(FX, 0, 12, 32), 4, 34));
  mk("path", { d: poly(ringAt(P, disc(FX, 0, 11.6, 32), 14)), class: "nf lo" }, g);
  const REST = 0.4, sp = spring(REST);
  let last = NaN;
  function draw(t) {
    const v = r2(t);
    if (v === last) return;
    last = v;
    const H = lerp(H0, lerp(H0, H1, travel), t);
    let [a, i] = rings(RX - 4, -4, RX + 5, 4, 2, 1);
    put(boss, prism(P, front, a, i, H + 20, H + 28));
    [a, i] = rings(RX + 4, -1.5, FX, 1.5, 1.4, 0.6);
    put(arm, prism(P, front, a, i, H + 22.5, H + 25.5));
    put(stem, prism(P, front, disc(FX, 0, 1.8, 12), disc(FX, 0, 1.1, 12), H - 46, H - 15));
    put(tap, prism(P, front, disc(FX, 0, 3.4, 16), disc(FX, 0, 2.4, 16), H - 30, H - 24));
    [a, i] = rings(FX - 1.5, -10, FX + 1.5, 10, 1.4, 0.6);
    put(handle, prism(P, front, a, i, H - 28, H - 26));
    const pts = [];
    for (const [z, r] of PEAR) pts.push(...ringAt(P, disc(FX, 0, r, 28), H + z));
    body.sil.setAttribute("d", poly(hull(pts)));
    body.cr.setAttribute("d", poly(ringAt(P, disc(FX, 0, 4, 20), H + 38)));
    put(plug, prism(P, front, disc(FX, 0, 3.2, 16), disc(FX, 0, 2.2, 16), H + 38, H + 44));
    layer.setAttribute("d", poly(ringAt(P, disc(FX, 0, 15.8, 32), H + 8)));
  }
  body.sil.classList.add("hi");
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const yLo = P(FX, 0, H0)[1], yHi = P(FX, 0, H1)[1], xL = P(-30, 28, 0)[0], xR = P(64, -28, 0)[0];
  function move([sx, sy]) {
    if (sx < xL - 10 || sx > xR + 10) return leave();
    sp.t = clamp((yLo - sy) / (yLo - yHi), 0, 1);
    read.textContent = "clamp " + Math.round(sp.t * 100);
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; last = NaN; draw(sp.x); }, destroy: bag.dispose };
}

hairline({
  name: "funnelrack",
  means: "A separating funnel clamped to a retort stand over a beaker: the pointer's height slides the clamp and funnel along the rod.",
  rules: [3, 5, 6, 8],
  range: [0.4, 1, 1],
  tour: [[211, 110], [211, 185], [211, 72], null],
  mount,
});
