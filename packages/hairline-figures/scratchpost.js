/**
 * Scratch posts: three posts of stepped heights on one base, each topped by
 * a round perch with a toy ball hanging from its rim on a cord. The pointer
 * picks a post by where it stands: its ball swings out as if batted, and
 * the balls beside it sway a little, staggered from it. At rest one ball is
 * already mid-swing, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rad, open, run,
} = HL;

const N = 3, STEP = 46, PR = 7, TR = 17, CORD = 26, BR = 8, BZ = 5, FAV = 1;
const H = [86, 62, 40], REST = [-6, 34, 8], SW = -62;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.72);
  const X1 = (N - 1) * STEP;
  fit(C, [[-TR - 4, -TR - 4, 0], [X1 + TR + 4, TR + 10, 0], [-TR, 0, H[0] + 6], [X1 + TR + 4, -TR - 4, 0], [-TR - 4, TR + 10, 0], [X1 + CORD, TR, H[2]]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-TR - 4, -TR - 4, X1 + TR + 4, TR + 10, 8, 2);
  put(solid(g), prism(P, front, sr, si, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g), h = H[k];
    put(solid(grp), prism(P, front, disc(x, 0, PR), disc(x, 0, PR - 1.5), BZ, h - 4));
    // sisal wrap: a few dim bands round the post
    for (let z = BZ + 8; z < h - 8; z += 9) mk("path", { d: open(ringAt(P, run(disc(x, 0, PR, 28), front), z)), class: "nf lo" }, grp);
    put(solid(grp), prism(P, front, disc(x, 0, TR, 40), disc(x, 0, TR - 2.5, 40), h - 4, h));
    const cord = mk("path", { class: "nf lo" }, grp), ball = mk("path", { class: "sil" }, grp);
    items.push({ k, x, h, cord, ball, a: tween(REST[k]), last: NaN });
  }

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const ax = it.x, ay = TR - 3, az = it.h - 4, t = rad(deg);
    const bx = ax + CORD * Math.sin(t), bz = az - CORD * Math.cos(t);
    it.cord.setAttribute("d", seg(P(ax, ay, az), P(bx, ay, bz)));
    const pts = [];
    for (let i = -3; i <= 3; i++) { const a = (i / 3) * (Math.PI / 2); pts.push(...ringAt(P, disc(bx, ay, BR * Math.cos(a) + 0.01, 20), bz - BR + BR * Math.sin(a))); }
    it.ball.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    const top = P(items[best].x, 0, items[best].h + 6)[1], bot = P(items[best].x, TR, 0)[1];
    return bd < 34 && sy > top && sy < bot + 10 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? REST[k] : dd === 0 ? SW : dd === 1 ? -16 : 0;
      tset(it.a, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.ball.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "post " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "scratchpost",
  means: "Three cat scratch posts of stepped heights: the toy ball on the post under the pointer swings out, and its neighbours sway a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[148, 133], [204, 179], [260, 223], null],
  mount,
});
