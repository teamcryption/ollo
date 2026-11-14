/**
 * Ward screen: a row of four privacy panels on little feet, each a framed
 * plate standing on its own pivot. The pointer picks a panel by where it is
 * along the row: that panel swings open on its pivot, its neighbours turn a
 * little after it, staggered from it. At rest the panels stand in an uneven
 * zigzag, the second one bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, picked by rest centre screen x.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rrect, seg, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 19, L = 17, T = 1.8, Z0 = 6, Z1 = 44, OPEN = 62;
const REST = [14, -16, 12, -10], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.4);
  const xs = Array.from({ length: N }, (_, k) => k * STEP);
  fit(C, [[-12, -12, 0], [xs[N - 1] + 12, 12, 0], [-12, 12, Z1], [xs[N - 1] + 12, -12, Z1], [xs[N - 1] + 12, 12, 0], [-12, -12, Z1]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // a rotated thin footprint: rrect samples turned by th about the pivot
  function turned(cx, th, inset) {
    const c = Math.cos(th), s = Math.sin(th);
    return rrect(-L / 2 + inset, -T / 2 + inset * 0.3, L / 2 - inset, T / 2 - inset * 0.3, 0.9 - inset * 0.3, 4).map((p) => ({
      u: cx + p.u * c - p.v * s, v: p.u * s + p.v * c, nu: p.nu * c - p.nv * s, nv: p.nu * s + p.nv * c,
    }));
  }
  const panels = xs.map((x, k) => {
    const lines = mk("path", { class: "nf lo" }, g);
    const feet = [flatDot(g, C, 1.4, "dot off"), flatDot(g, C, 1.4, "dot off")];
    const s = solid(g), rail = mk("path", { class: "nf lo" }, s.g);
    return { k, x, s, lines, feet, rail, th: tween(REST[k]), last: NaN };
  });
  function draw(p, deg) {
    if (deg === p.last) return;
    p.last = deg;
    const th = (deg * Math.PI) / 180, c = Math.cos(th), sn = Math.sin(th);
    put(p.s, prism(P, front, turned(p.x, th, 0), turned(p.x, th, 0.6), Z0, Z1));
    const e = [[p.x - (L / 2 - 1.5) * c, -(L / 2 - 1.5) * sn], [p.x + (L / 2 - 1.5) * c, (L / 2 - 1.5) * sn]];
    p.lines.setAttribute("d", e.map(([x, y]) => seg(P(x, y, 0.5), P(x, y, Z0))).join(""));
    e.forEach(([x, y], i) => place(p.feet[i], P(x, y, 0)));
    // the curtain rail and hem on the face turned to the viewer
    let nx = -sn, ny = c; if (nx + ny < 0) { nx = -nx; ny = -ny; }
    const o = T / 2 + 0.05, a = (t, z) => P(p.x + t * c + nx * o, t * sn + ny * o, z);
    p.rail.setAttribute("d", seg(a(-L / 2 + 2, Z1 - 5), a(L / 2 - 2, Z1 - 5)) + seg(a(-L / 2 + 2, Z0 + 4), a(L / 2 - 2, Z0 + 4)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    panels.forEach((p) => { draw(p, tval(p.th, now)); if (!tdone(p.th, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest rest centre by screen x, inside the row's band
  const cx = xs.map((x) => P(x, 0, (Z0 + Z1) / 2)[0]);
  const top = P(0, 0, Z1 + 4)[1] - 20, bot = P(xs[N - 1], 0, 0)[1] + 20;
  function hit([sx, sy]) {
    if (sy < top || sy > bot || sx < cx[0] - 40 || sx > cx[N - 1] + 40) return -1;
    let best = 0;
    cx.forEach((v, k) => { if (Math.abs(v - sx) < Math.abs(cx[best] - sx)) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    panels.forEach((p) => {
      const d = Math.abs(p.k - a);
      const deg = a < 0 ? REST[p.k] : d === 0 ? OPEN : clamp(REST[p.k] + (p.k < a ? -1 : 1) * 14 / d, -40, 40);
      tset(p.th, deg, now, from < 0 ? 0 : Math.abs(p.k - from) * stag);
      p.s.sil.classList.toggle("hi", p.k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "panel " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hospitalscreen",
  means: "A ward screen: the panel under the pointer swings open on its pivot, its neighbours turn a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[131, 123], [177, 146], [269, 191], null],
  mount,
});
