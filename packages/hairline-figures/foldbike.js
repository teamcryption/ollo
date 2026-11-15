/**
 * Folding scooter: a kick scooter with a long deck, two small wheels and a
 * T-bar stem hinged at the front of the deck. The pointer along the deck
 * folds the stem down over it; toward the front it stands again. At rest the
 * stem leans half folded, bright.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, clamp, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid, unproj } = HL;

const L = 70, Y0 = 8, Y1 = 22, DZ = 9, HX = 62, SL = 58, BAR = 16, R = 7, REST = 0.55, MAX = 1.42;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-2, 0, 0], [L + 6, 30, 0], [L + 6, 0, 0], [-2, 30, 0], [HX, 15, DZ + SL + 4], [HX - SL, 15, DZ + 10]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x) => { const pts = []; for (const y of [12, 18]) pts.push(...circ(R, 28).map((q) => P(x + q.u, y, R + q.v))); return { sil: poly(hull(pts)), crease: poly(circ(2.5, 16).map((q) => P(x + q.u, 18, R + q.v))) }; };
  put(solid(g), wheel(6));
  const [dr, di] = rings(0, Y0, L - 4, Y1, 5, 1.4);
  put(solid(g), prism(P, front, dr, di, DZ - 3, DZ));
  put(solid(g), wheel(L));
  const stem = mk("path", { class: "sil hi" }, g), bar = mk("path", { class: "sil" }, g), grips = mk("path", { class: "nf lo" }, g);
  const ang = tween(REST);
  const at = (s, y, a, dx = 0) => P(HX - s * Math.sin(a) + dx * Math.cos(a), y, DZ + s * Math.cos(a) + dx * Math.sin(a));
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const sp = [];
    for (const y of [13, 17]) for (const s of [0, SL]) for (const dx of [-1.6, 1.6]) sp.push(at(s, y, a, dx));
    stem.setAttribute("d", poly(hull(sp)));
    const bp = [];
    for (const y of [15 - BAR, 15 + BAR]) for (const s of [SL - 1.5, SL + 1.5]) for (const dx of [-1.5, 1.5]) bp.push(at(s, y, a, dx));
    bar.setAttribute("d", poly(hull(bp)));
    grips.setAttribute("d", poly([at(SL, 15 + BAR - 6, a, 2), at(SL, 15 + BAR, a, 2), at(SL, 15 + BAR, a, -2), at(SL, 15 + BAR - 6, a, -2)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  function set(p) {
    const now = performance.now();
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x > -30 && x < L + 20 && y > -20 && y < 50) {
        const t = clamp(1 - x / L, 0, 1), a = clamp(0.05 + t * MAX * (0.5 + reach / 200), 0.05, MAX);
        tset(ang, a, now, 0);
        read.textContent = Math.round((a / MAX) * 100) + "% fold";
        B.wake();
        return;
      }
    }
    tset(ang, REST, now, 0);
    read.textContent = "rest";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "foldbike",
  means: "A folding kick scooter: the T-bar stem folds down over the deck as the pointer moves to the tail, and stands up again at the front.",
  rules: [1, 3, 4, 5],
  range: [0, 60, 100],
  tour: [[139, 162], [265, 248], [127, 178], null],
  mount,
});
