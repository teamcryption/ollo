/**
 * Ladle stand: a bar on two posts over a base, four ladles of different
 * sizes hanging from it. The pointer picks a ladle by where it stands: it
 * swings out off the bar toward the viewer, and its neighbours sway a
 * little, staggered from it. At rest one ladle hangs swung out, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, PAD = 16, H = 92, FAV = 2;
const X1 = PAD * 2 + (N - 1) * STEP;
const LEN = [50, 62, 56, 44], BOWL = [9, 11, 8, 7], REST = [4, -3, 28, 6];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-PAD, -18, 0], [X1 + PAD, 18, 0], [X1 + PAD, -18, 0], [-PAD, 18, 0], [0, 0, H + 6], [X1, 0, H + 6], [PAD + STEP, 62 * Math.sin(rad(58)), H - 62 * Math.cos(rad(58))]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-PAD, -18, X1 + PAD, 18, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  for (const x of [0, X1]) put(solid(g), prism(P, front, disc(x, 0, 3.2), disc(x, 0, 2.2), 5, H + 2));
  const [rr, ri] = rings(-4, -2.6, X1 + 4, 2.6, 2.6, 1);
  put(solid(g), prism(P, front, rr, ri, H, H + 5));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = PAD + k * STEP, grp = mk("g", {}, g);
    const handle = mk("path", { class: "sil" }, grp), bowl = mk("path", { class: "sil" }, grp), lip = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, handle, bowl, lip, a: tween(REST[k]), last: NaN });
  }

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const L = LEN[it.k], R = BOWL[it.k], s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const at = (d) => [d * s, H + 1 - d * c];
    const [y0, z0] = at(0), [y1, z1] = at(L - R);
    it.handle.setAttribute("d", poly(hull(ringAt(P, disc(it.x, y0, 1.6, 10), z0).concat(ringAt(P, disc(it.x, y1, 1.6, 10), z1)))));
    const [cy, cz] = at(L);
    const pts = [];
    for (let i = 0; i <= 4; i++) { const t = (i / 4) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, cy, R * Math.cos(t)), cz - R * 0.8 * Math.sin(t))); }
    it.bowl.setAttribute("d", poly(hull(pts)));
    it.lip.setAttribute("d", poly(ringAt(P, disc(it.x, cy, R - 1.6), cz)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, H - LEN[it.k] / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), to = a < 0 ? REST[k] : dd === 0 ? 58 : dd === 1 ? 12 : REST[k] * 0.5;
      tset(it.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.handle.classList.toggle("hi", on);
      it.bowl.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "ladle " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "soupkettle",
  means: "Four ladles hanging from a stand: the ladle under the pointer swings out off the bar, and its neighbours sway a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 112], [179, 127], [236, 150], null],
  mount,
});
