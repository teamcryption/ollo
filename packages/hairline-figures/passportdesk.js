/**
 * Passport control: a row of three booths, each a cabin with a raised roof,
 * a desk window on its lane side and a barrier arm across the lane beside it.
 * The pointer picks a lane by where it is along the row: that arm swings up,
 * the others lift a little after it, staggered from it. At rest the arms sit
 * unevenly, the middle one bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, picked by rest centre screen x.
 */
const {
  Cam, facing, fit, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 31, BW = 10, BD = 16, BH = 26, ARM = 15, AZ = 11, OPEN = 84;
const REST = [8, 2, 14], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.2);
  const xs = Array.from({ length: N }, (_, k) => k * STEP);
  const XE = xs[N - 1] + BW + ARM + 2;
  fit(C, [[-2, -2, 0], [XE, BD + 2, 0], [XE, -2, BH + 4], [-2, BD + 2, BH + 4], [xs[N - 1] + BW + 2, BD, AZ + ARM]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const booths = xs.map((x, k) => {
    const body = solid(g);
    { const [r, i] = rings(x, 0, x + BW, BD, 2, 0.8); put(body, prism(P, front, r, i, 0, BH)); }
    // the desk window on the lane side (+x face) and the counter under it
    mk("path", { class: "nf lo", d: poly([P(x + BW, 4, 12), P(x + BW, 12, 12), P(x + BW, 12, 21), P(x + BW, 4, 21)]) + seg(P(x + BW + 0.1, 3, 11), P(x + BW + 0.1, 13, 11)) }, body.g);
    const roof = solid(g);
    { const [r, i] = rings(x - 1.5, -1.5, x + BW + 1.5, BD + 1.5, 2.6, 1); put(roof, prism(P, front, r, i, BH, BH + 2.2)); }
    const post = solid(g);
    { const [r, i] = rings(x + BW + 0.5, BD - 3, x + BW + 3.5, BD, 1.2, 0.5); put(post, prism(P, front, r, i, 0, AZ + 1.5)); }
    const arm = mk("path", { class: "sil" }, g);
    return { k, x, arm, a: tween(REST[k]), last: NaN };
  });
  function draw(b, deg) {
    if (deg === b.last) return;
    b.last = deg;
    const t = (deg * Math.PI) / 180, hx = b.x + BW + 2, y = BD - 1.5;
    const pts = [];
    [[0, -0.9], [ARM, -0.9], [ARM, 0.9], [0, 0.9]].forEach(([u, w]) => {
      const x = hx + u * Math.cos(t) - w * Math.sin(t), z = AZ + u * Math.sin(t) + w * Math.cos(t);
      pts.push(P(x, y - 0.8, z), P(x, y + 0.8, z));
    });
    b.arm.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    booths.forEach((b) => { draw(b, tval(b.a, now)); if (!tdone(b.a, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest rest centre (booth plus its lane) by screen x, inside the row's band
  const cx = xs.map((x) => P(x + BW + 4, BD / 2, BH / 2)[0]);
  const top = P(0, 0, BH + 4)[1] - 10, bot = P(XE, BD, 0)[1] + 10;
  function hit([sx, sy]) {
    if (sy < top || sy > bot || sx < cx[0] - 45 || sx > cx[N - 1] + 45) return -1;
    let best = 0;
    cx.forEach((v, k) => { if (Math.abs(v - sx) < Math.abs(cx[best] - sx)) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    booths.forEach((b) => {
      const d = Math.abs(b.k - a);
      tset(b.a, a < 0 ? REST[b.k] : d === 0 ? OPEN : 20 / d, now, from < 0 ? 0 : Math.abs(b.k - from) * stag);
      b.arm.classList.toggle("hi", b.k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "lane " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "passportdesk",
  means: "Passport control: the barrier arm of the lane under the pointer swings up, the others lift a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[130, 125], [200, 160], [270, 195], null],
  mount,
});
