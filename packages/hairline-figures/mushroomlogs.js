/**
 * Mushroom logs: four cut logs stood on end in a growing bed, each with a
 * mushroom on its top. The pointer picks a log by where it stands: its
 * mushroom pushes up and its cap spreads, and the mushrooms beside it grow
 * a little, staggered from it. At rest one mushroom stands tall, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, LR = 12, FAV = 1, BZ = 4, GROW = 26;
const HS = [30, 42, 24, 36], REST = [4, 16, 7, 2];
const X1 = (N - 1) * STEP + 2 * LR;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * LR + 6, 0], [X1 + 6, -6, 0], [-6, 2 * LR + 6, 0], [LR + STEP, LR, BZ + 42 + GROW + 12], [X1 - LR, LR, BZ + 36 + GROW + 12]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, X1 + 6, 2 * LR + 6, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = LR + k * STEP, y = LR, top = BZ + HS[k], grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, LR), disc(x, y, LR - 2), BZ, top));
    // growth rings on the cut face
    mk("path", { d: poly(ringAt(P, disc(x, y, LR * 0.55, 28), top)), class: "nf lo" }, grp);
    const stem = mk("path", { class: "nf" }, grp), cap = mk("path", { class: "sil" }, grp), gill = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, top, stem, cap, gill, h: tween(REST[k]), last: NaN });
  }

  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    const sx = it.x + 2, z0 = it.top, z1 = z0 + 3 + h, R = 6 + h * 0.18;
    it.stem.setAttribute("d", poly(hull(ringAt(P, disc(sx, it.y, 2.4, 16), z0).concat(ringAt(P, disc(sx, it.y, 2.4, 16), z1)))));
    const pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(sx, it.y, R * Math.cos(t), 28), z1 + R * 0.7 * Math.sin(t))); }
    it.cap.setAttribute("d", poly(hull(pts)));
    it.gill.setAttribute("d", poly(ringAt(P, disc(sx, it.y, R - 1.5, 28), z1 + 1)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.h, now)); if (!tdone(it.h, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, it.top / 2 + 10));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 75 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), to = a < 0 ? REST[k] : dd === 0 ? GROW : dd === 1 ? 9 : 3;
      tset(it.h, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.cap.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "log " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "mushroomlogs",
  means: "Four cut logs in a growing bed: the mushroom on the log under the pointer pushes up and spreads, its neighbours grow a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[179, 157], [262, 215], [138, 153], null],
  mount,
});
