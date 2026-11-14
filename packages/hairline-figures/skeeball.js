/**
 * Skee ball: three arcade lanes side by side, each a long alley ending in a
 * raised target box with ring holes on its top. The pointer picks a lane by
 * where it stands: that lane's ball rolls up the alley into the rings, and
 * the balls beside it start a little, staggered from it. At rest one ball
 * is halfway up its lane, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, lerp, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 28, STEP = 36, L = 110, BOX = 30, BH = 16, LZ = 4, R = 8, FAV = 1;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  const X1 = (N - 1) * STEP + W;
  fit(C, [[-2, -BOX - 2, 0], [X1 + 2, L + 2, 0], [X1 + 2, -BOX - 2, BH + 2 * R + 2], [-2, L + 2, 0], [-2, -BOX - 2, BH + 2 * R + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, xc = x0 + W / 2, grp = mk("g", {}, g);
    const [lr, li] = rings(x0, 0, x0 + W, L, 4, 1.6);
    put(solid(grp), prism(P, front, lr, li, 0, LZ));
    mk("path", { d: poly(ringAt(P, rings(x0 + 5, 4, x0 + W - 5, L - 4, 3, 1)[0], LZ)), class: "nf lo" }, grp);
    const [br, bi] = rings(x0, -BOX, x0 + W, 0, 5, 1.8);
    put(solid(grp), prism(P, front, br, bi, 0, BH));
    for (const r of [11, 7, 3]) mk("path", { d: poly(ringAt(P, disc(xc, -BOX / 2, r, 32), BH)), class: "nf lo" }, grp);
    const ball = mk("path", { class: "sil" }, grp);
    items.push({ k, xc, ball, t: tween(k === FAV ? 0.45 : 0), last: NaN });
  }

  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const y = lerp(L - 12, -BOX / 2, t);
    const z = (y > 0 ? LZ : BH) + R - (y > 0 ? 0 : 3);
    const pts = [];
    for (let i = -3; i <= 3; i++) { const a = (i / 3) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.xc, y, R * Math.cos(a) + 0.01, 20), z + R * Math.sin(a))); }
    it.ball.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.xc, L / 2, LZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => {
      const a = P(it.xc, -BOX, 0), b = P(it.xc, L, 0);
      const u = Math.max(0, Math.min(1, ((sx - a[0]) * (b[0] - a[0]) + (sy - a[1]) * (b[1] - a[1])) / ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2)));
      const dd = Math.hypot(sx - lerp(a[0], b[0], u), sy - lerp(a[1], b[1], u));
      if (dd < bd) { bd = dd; best = k; }
    });
    return bd < 26 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? 0.45 : 0) : dd === 0 ? 1 : dd === 1 ? 0.2 : 0;
      tset(it.t, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.ball.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "skeeball",
  means: "Three skee ball lanes: the ball in the lane under the pointer rolls up the alley into the target rings; its neighbours start a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[137, 173], [181, 195], [226, 217], null],
  mount,
});
