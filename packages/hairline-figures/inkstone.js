/**
 * Ink stone: a flat stone slab with a sunken well, and a square ink stick
 * lying across it, bright. The pointer over the stone tilts the stick up
 * onto its end, ready to grind in the well. The slider is how far the
 * stick tilts.
 *
 * The pattern: one part tilting on its foot (tilt).
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 84, D = 54, SZ = 10, L = 50, K = 12, BX = 60, BY = 22, REST = 10;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tilt = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [BX, BY, SZ + L + 4], [BX - L, BY, SZ + 14]], 200, 165);
  const P = proj(C), front = facing(C);
  const H2 = (pts) => poly(hull(pts.map((p) => P(p[0], p[1], p[2]))));
  const g = mk("g", {}, svg);
  const [r0, r1] = rings(0, 0, W, D, 9, 5);
  put(solid(g), prism(P, front, r0, r1, 0, SZ));
  // the well, sunk at the near end
  const [w0, w1] = rings(10, 8, 34, D - 8, 8, 2);
  mk("path", { d: prism(P, front, w0, w1, SZ - 0.5, SZ).sil, class: "nf lo" }, g);
  const stick = mk("path", { class: "sil hi" }, g), face = mk("path", { class: "nf lo" }, g);
  const tw = tween(REST);
  let last = NaN;
  // a point of the stick: s along it, n across it, y beside it
  const S = (s, n, y, a) => [BX - s * Math.cos(a) + n * Math.sin(a), BY + y, SZ + s * Math.sin(a) + n * Math.cos(a)];
  function draw(d) {
    if (d === last) return;
    last = d;
    const a = rad(d), pts = [];
    for (const s of [0, L]) for (const n of [0, K]) for (const y of [0, K]) pts.push(S(s, n, y, a));
    stick.setAttribute("d", H2(pts));
    face.setAttribute("d", poly([S(L, 0, K, a), S(L, K, K, a), S(0, K, K, a), S(0, 0, K, a)].map((p) => P(...p))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, D / 2, SZ);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? tilt : REST, performance.now(), 0);
    read.textContent = on ? "grind" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 120), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tilt = v; if (act) { tset(tw, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "inkstone",
  means: "An ink stone with a square ink stick lying on it: the pointer tilts the stick up onto its end, ready to grind.",
  rules: [1, 3, 5, 6],
  range: [45, 75, 90],
  tour: [[185, 140], [327, 191], [73, 186], null],
  mount,
});
