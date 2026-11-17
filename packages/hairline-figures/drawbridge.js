/**
 * Drawbridge: a castle gatehouse wall with battlements and a plank bridge
 * hinged at the foot of its gate, held up by two chains. The pointer in front
 * of the wall lowers the bridge across the ground; leaving winds it back up.
 * At rest the bridge hangs half raised, bright. The slider is how far it drops.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 90, T = 16, H = 56, G0 = 30, G1 = 60, GH = 36, L = 40, TH = 3, REST = 1.0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let drop = value / 100;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, 0, 0], [W, T + L, 0], [W, 0, 0], [0, T + L, 0], [0, 0, H + 8], [W, T, H + 8]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, i0] = rings(0, 0, W, T, 1, 1);
  put(solid(g), prism(P, front, r0, i0, 0, H));
  for (const x of [0, 26, 52, 78]) { const [r, i] = rings(x, 0, x + 12, T, 1, 1); put(solid(g), prism(P, front, r, i, H, H + 8)); }
  const arch = [];
  for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI; arch.push(P((G0 + G1) / 2 + ((G1 - G0) / 2) * Math.cos(a), T, GH - 15 + 15 * Math.sin(a))); }
  mk("path", { d: poly([P(G1, T, 0), ...arch, P(G0, T, 0)]), class: "nf" }, g);
  const chains = mk("path", { class: "nf lo" }, g), plank = mk("path", { class: "sil" }, g);

  const th = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a), pts = [];
    for (const x of [G0, G1]) for (const [d, n] of [[0, 0], [L, 0], [0, TH], [L, TH]]) pts.push(P(x, T + d * c - n * s, 1 + d * s + n * c));
    plank.setAttribute("d", poly(hull(pts)));
    const ty = T + (L - 2) * c, tz = 1 + (L - 2) * s + TH;
    chains.setAttribute("d", seg(P(G0 + 2, T, GH + 10), P(G0 + 2, ty, tz)) + seg(P(G1 - 2, T, GH + 10), P(G1 - 2, ty, tz)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(th, now)); return !tdone(th, now); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(th, a < 0 ? REST : 1.45 - 1.43 * drop, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "down";
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    setActive(x > -20 && x < W + 20 && y > T - 4 && y < T + L + 20 ? 1 : -1);
  }
  plank.classList.add("hi");
  setActive(-1);
  bag.add(pointer(stage, { move, leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { drop = v / 100; if (act >= 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "drawbridge",
  means: "A castle gate whose plank bridge, held on two chains, lowers across the ground when the pointer comes in front of it.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[179, 238], [240, 269], [200, 250], null],
  mount,
});
