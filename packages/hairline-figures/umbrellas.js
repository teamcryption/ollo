/**
 * Umbrellas: a long stand holding four closed umbrellas, tip down, each a
 * folded canopy on a shaft with a crook handle. The pointer picks an umbrella
 * by where it stands: it lifts out of the stand, and its neighbours rise a
 * little, staggered from it. At rest one umbrella is half drawn, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 22, W = 26, H = 30, LIFT = 30, FAV = 2, CR = 7;
const X1 = (N - 1) * STEP + 26, LEN = [66, 72, 62, 70];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [X1, W, 0], [X1, 0, 0], [0, W, 0], [13, W / 2, 6 + 72 + LIFT + 8], [X1 - 13, W / 2, 6 + 72 + LIFT + 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, 0, X1, W, 8, 2);
  put(solid(g), prism(P, front, sr, si, 0, H));
  // the opening, seen from above, behind the umbrellas
  mk("path", { d: poly(ringAt(P, si, H)), class: "nf lo" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 13 + k * STEP, y = W / 2, grp = mk("g", {}, g);
    const canopy = mk("path", { class: "sil" }, grp), fold = mk("path", { class: "nf lo" }, grp);
    const shaft = mk("path", { class: "nf" }, grp), hook = mk("path", { class: "nf" }, grp);
    items.push({ k, x, y, len: LEN[k], grp, canopy, fold, shaft, hook, z: tween(k === FAV ? LIFT * 0.55 : 0), last: NaN });
  }
  // the stand's front wall, painted over the umbrellas' feet
  const fr = run(sr, front);
  const wall = ringAt(P, fr, H).concat(ringAt(P, fr, 0).reverse());
  mk("path", { d: poly(wall), class: "" }, g);
  mk("path", { d: open(ringAt(P, run(si, front), H)), class: "nf lo" }, g);
  mk("path", { d: open(ringAt(P, fr, H * 0.35)), class: "nf lo" }, g);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = 4 + lift, L = it.len, pts = [];
    for (const [r, f] of [[0.6, 0], [CR, 0.28], [CR * 0.8, 0.5], [1.6, 0.8]]) pts.push(...ringAt(P, disc(it.x, it.y, r), z0 + 6 + f * (L - 18)));
    it.canopy.setAttribute("d", poly(hull(pts)));
    const a = P(it.x, it.y, z0), b = P(it.x, it.y, z0 + 6);
    // a seam where the folded panels wrap
    const s0 = P(it.x + CR * 0.3, it.y + CR * 0.3, z0 + 6 + 0.1 * (L - 18)), s1 = P(it.x + CR * 0.55, it.y + CR * 0.55, z0 + 6 + 0.32 * (L - 18)), s2 = P(it.x + 1, it.y + 1, z0 + 6 + 0.8 * (L - 18));
    it.fold.setAttribute("d", open([s0, s1, s2]));
    const t = P(it.x, it.y, z0 + 6 + 0.8 * (L - 18)), h = P(it.x, it.y, z0 + L);
    it.shaft.setAttribute("d", "M" + a.join(",") + "L" + b.join(",") + "M" + t.join(",") + "L" + h.join(","));
    // the crook: a J turning away along +x
    const J = [];
    for (let i = 0; i <= 10; i++) { const q = (i / 10) * Math.PI; J.push(P(it.x + 5 - 5 * Math.cos(q), it.y, z0 + L + 5 * Math.sin(q))); }
    J.push(P(it.x + 10, it.y, z0 + L - 3));
    it.hook.setAttribute("d", open(J));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, 40));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.55 : 0) : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.canopy.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "no. " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "umbrellas",
  means: "Four closed umbrellas in a stand: the one under the pointer lifts out by its crook, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[147, 127], [218, 183], [253, 180], null],
  mount,
});
