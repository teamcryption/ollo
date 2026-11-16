/**
 * Sun visor: the top of a windscreen with its pillars and roof header, and
 * the visor hinged under the header. At rest it is folded up flat, bright.
 * The pointer over the glass swings it down on its rod to shade the screen;
 * the slider is how far it drops.
 *
 * The pattern: one hinged part (swing).
 */
const { Cam, fit, facing, hull, poly, open, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 110, H = 54, HY = 9, HZ = H - 2, X0 = 14, X1 = 74, L = 26, T = 1.8, REST = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [W, 0, 0], [W, 12, 0], [0, 12, 0], [0, 0, H + 5], [W, 12, H + 5], [X0, HY + L + 2, HZ], [X1, HY + L + 2, HZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // glass edge, dash top line, then pillars and header
  mk("path", { d: poly([P(6, 0, 4), P(W - 6, 0, 4), P(W - 6, 0, H), P(6, 0, H)]), class: "nf lo" }, g);
  mk("path", { d: open([P(18, 0, 30), P(34, 0, 44)]), class: "nf lo" }, g);
  mk("path", { d: open([P(26, 0, 24), P(48, 0, 44)]), class: "nf lo" }, g);
  for (const x of [0, W - 6]) { const [r, i] = rings(x, 0, x + 6, 12, 2, 1); put(solid(g), prism(P, front, r, i, 0, H)); }
  { const [r, i] = rings(0, 0, W, 12, 2, 1); put(solid(g), prism(P, front, r, i, H, H + 5)); }
  { const [r, i] = rings(0, 0, W, 12, 2, 1); put(solid(g), prism(P, front, r, i, 0, 4)); }
  // hinge rod bracket and clip
  mk("path", { d: open([P(X0 - 6, HY, H), P(X0 - 6, HY, HZ), P(X1 + 3, HY, HZ)]), class: "nf" }, g);
  mk("path", { d: open([P(X1 + 6, HY, H), P(X1 + 6, HY, HZ - 2)]), class: "nf" }, g);
  const visor = mk("path", { class: "sil" }, g), pad = mk("path", { class: "nf lo" }, g), mirror = mk("path", { class: "nf" }, g);
  const R = (x, dy, dz, a) => { const c = Math.cos(a), s = Math.sin(a); return P(x, HY + dy * c - dz * s, HZ + dy * s + dz * c); };
  const ang = tween(REST);
  let last = NaN;
  function draw(drop) {
    if (drop === last) return;
    last = drop;
    const a = ((90 - drop) * Math.PI) / 180, pts = [];
    for (const x of [X0, X1]) for (const dy of [-T, T]) for (const dz of [-1, -L]) pts.push(R(x, dy, dz, a));
    visor.setAttribute("d", poly(hull(pts)));
    pad.setAttribute("d", open([R(X0 + 3, T, -4, a), R(X1 - 3, T, -4, a)]));
    mirror.setAttribute("d", poly([R(30, T, -8, a), R(58, T, -8, a), R(58, T, -20, a), R(30, T, -20, a)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, 0, H / 2);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a > 0 ? maxA : REST, performance.now(), 0);
    visor.classList.add("hi");
    read.textContent = a > 0 ? Math.round(maxA) + "°" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 150 && Math.abs(sy - mid[1]) < 110 ? 1 : -1),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act > 0) { tset(ang, v, performance.now(), 0); read.textContent = Math.round(v) + "°"; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "sunvisor",
  means: "A car sun visor folded up under the roof header: the pointer over the windscreen swings it down on its rod to shade the glass.",
  rules: [1, 4, 5, 8],
  range: [55, 85, 95],
  tour: [[146, 127], [200, 170], [250, 140], null],
  mount,
});
