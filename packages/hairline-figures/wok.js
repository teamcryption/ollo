/**
 * Wok: a deep round pan with a long handle, sitting on a burner. The pointer
 * over it tosses: the pan lifts and tips back on its handle and the food
 * jumps up out of the bowl. At rest the pan sits level, its bowl bright.
 * The slider is how hard it tosses.
 *
 * The pattern: one part tilting on its body.
 */
const { Cam, circ, fit, hull, poly, prism, proj, facing, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const RR = 30, RB = 11, BH = 16, BZ = 12, HL0 = 30, HL1 = 74;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let toss = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-34, -34, 0], [34, 34, 0], [HL1, 0, 40], [-34, 34, 70], [34, -34, 70]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-26, -26, 26, 26, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, 9));
  const [gr, gi] = rings(-14, -14, 14, 14, 7, 1.5);
  put(solid(g), prism(P, front, gr, gi, 9, 11));

  const handle = mk("path", { class: "sil" }, g), bowl = mk("path", { class: "sil hi" }, g), rim = mk("path", { class: "nf lo" }, g);
  const food = [0, 1, 2, 3].map(() => mk("path", {}, g));
  const t = tween(0);
  let last = NaN;
  const ring = (r, z, n = 36) => circ(r, n).map((q) => [q.u, q.v, z]);
  function draw(s) {
    if (s === last) return;
    last = s;
    const a = -s * 0.012, lift = s * 0.35, ca = Math.cos(a), sa = Math.sin(a);
    const W = ([x, y, z]) => { const zz = z - BZ; return P(x * ca - zz * sa, y, BZ + x * sa + zz * ca + lift); };
    const top = ring(RR, BZ + BH), pts = [];
    for (let i = 0; i <= 5; i++) { const f = i / 5; pts.push(...ring(RB + (RR - RB) * Math.sin(f * Math.PI / 2), BZ + BH * (1 - Math.cos(f * Math.PI / 2)) )); }
    bowl.setAttribute("d", poly(hull(pts.map(W))));
    rim.setAttribute("d", poly(top.map(W)));
    const hp = [];
    for (const x of [HL0, HL1]) for (const q of circ(2.6, 12)) hp.push(W([x, q.u, BZ + BH - 2 + q.v + (x - HL0) * 0.25]));
    handle.setAttribute("d", poly(hull(hp)));
    const spots = [[-8, -5], [6, -8], [2, 7], [-6, 6]];
    food.forEach((el, k) => {
      const [x, y] = spots[k], up = s * (0.65 + k * 0.15);
      el.setAttribute("d", poly(hull(circ(3.4, 12).flatMap((q) => [W([x + q.u, y + q.v, BZ + 6 + up]), W([x + q.u, y + q.v, BZ + 9 + up])]))));
    });
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  const mid = P(10, 0, BZ);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(t, on ? toss : 0, performance.now(), 0);
    read.textContent = on ? "toss" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], (sy - mid[1]) * 1.4) < 120), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { toss = v; if (act) { tset(t, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "wok",
  means: "A wok on a burner: the pointer over it tosses, tipping the pan back on its handle so the food jumps up out of the bowl.",
  rules: [1, 5, 6],
  range: [16, 32, 40],
  tour: [[214, 193], [194, 160], [194, 262], null],
  mount,
});
