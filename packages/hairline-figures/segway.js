/**
 * Self-balancing scooter: two big wheels on one axle, a low deck between
 * them and a tall stem with a wide handlebar. The pointer ahead of or behind
 * the axle tilts the deck and stem forward or back about the axle. At rest
 * the stem leans a little forward, bright.
 */
const { Cam, circ, rrect, fit, hull, poly, proj, clamp, spring, stepS, disposer, mk, pointer, register, solid, unproj } = HL;

const R = 15, SL = 66, REST = 0.16, MAX = 0.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-R - 30, -24, 0], [R + 30, 24, 0], [-34, 0, R + SL + 4], [34, 0, R + SL + 4]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const wheel = (y0, y1) => {
    const pts = [];
    for (const y of [y0, y1]) pts.push(...circ(R, 32).map((q) => P(q.u, y, R + q.v)));
    const s = solid(g);
    s.sil.setAttribute("d", poly(hull(pts)));
    const yo = y1 > 0 ? y1 : y0;
    s.cr.setAttribute("d", poly(circ(R - 3, 24).map((q) => P(q.u, yo, R + q.v))) + poly(circ(4, 16).map((q) => P(q.u, yo, R + q.v))));
  };
  wheel(-24, -17);
  const deck = solid(g), stem = solid(g), bar = solid(g);
  stem.sil.classList.add("hi");
  wheel(17, 24);
  const rot = (a) => (x, y, z) => { const dz = z - R; return P(x * Math.cos(a) + dz * Math.sin(a), y, R - x * Math.sin(a) + dz * Math.cos(a)); };
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const T = rot(a);
    const dr = rrect(-12, -15, 12, 15, 4, 4), di = rrect(-10.5, -13.5, 10.5, 13.5, 3, 4);
    const dp = [];
    for (const z of [R - 5, R - 1]) dp.push(...dr.map((q) => T(q.u, q.v, z)));
    deck.sil.setAttribute("d", poly(hull(dp)));
    deck.cr.setAttribute("d", poly(di.map((q) => T(q.u, q.v, R - 1))));
    const sp = [];
    for (const z of [R - 1, R + SL]) sp.push(...circ(2.6, 12).map((q) => T(4 + q.u, q.v, z)));
    stem.sil.setAttribute("d", poly(hull(sp)));
    stem.cr.setAttribute("d", "");
    const bp = [];
    for (const y of [-17, 17]) for (const q of circ(2.4, 10)) bp.push(T(4 + q.u, y, R + SL + q.v));
    bar.sil.setAttribute("d", poly(hull(bp)));
    bar.cr.setAttribute("d", poly([T(4, -17, R + SL + 2.4), T(4, -11, R + SL + 2.4), T(4, -11, R + SL - 2.4), T(4, -17, R + SL - 2.4)]) + poly([T(4, 11, R + SL + 2.4), T(4, 17, R + SL + 2.4), T(4, 17, R + SL - 2.4), T(4, 11, R + SL - 2.4)]));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function set(p) {
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.abs(x) < 70 && Math.abs(y) < 50) {
        const t = clamp(x / 50, -1, 1), a = t * MAX * (0.3 + 0.7 * reach / 100);
        ang.t = a;
        const d = Math.round((a * 180) / Math.PI);
        read.textContent = (d > 0 ? "+" : "") + d + "°";
        B.wake();
        return;
      }
    }
    ang.t = REST;
    read.textContent = "rest";
    B.wake();
  }
  set(null);
  draw(REST);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "segway",
  means: "A self-balancing scooter: the stem and deck tilt forward or back about the axle as the pointer moves ahead of or behind it.",
  rules: [1, 3, 4, 5],
  range: [0, 70, 100],
  tour: [[278, 289], [112, 206], [230, 262], null],
  mount,
});
