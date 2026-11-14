/**
 * Wine casks: four bulging casks lying side by side on two cradle rails,
 * each with its head toward the reader, two hoops and a bung on top. The
 * pointer picks a cask by where it stands: it tips up on its front edge,
 * its back end raised, as a cellar tips a cask to draw the last of it, and
 * the casks beside it tip a little, staggered from it. At rest one cask is
 * already tipped, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), each part rotated about
 * its own pivot and redrawn as a hull.
 */
const {
  Cam, fit, hull, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 36, R = 13, RM = 16, LEN = 44, RZ = 5, TIP = 26, FAV = 2;
const REST = [3, 0, 16, 5];
const X1 = (N - 1) * STEP + 2 * RM;
const VIEW = [0.612, 0.612, 0.5];
const rOf = (yy) => R + (RM - R) * Math.sin((Math.PI * yy) / LEN);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  const ext = [[-4, -4, 0], [X1 + 4, LEN + 4, 0], [X1 + 4, -4, 0], [-4, LEN + 4, 0]];
  for (const x of [RM, X1 - RM]) ext.push([x, 4, RZ + LEN * Math.sin((TIP * Math.PI) / 180) + 2 * RM]);
  fit(C, ext, 200, 170);
  const P = proj(C);
  const g = mk("g", {}, svg);
  for (const ry of [7, LEN - 9]) {
    const [a, b] = rings(-4, ry - 3, X1 + 4, ry + 3, 2, 0.8);
    put(solid(g), prism(P, () => true, a, b, 0, RZ));
  }

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = RM + k * STEP, grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), head = mk("path", { class: "nf lo" }, grp);
    const hoops = mk("path", { class: "nf lo" }, grp), bung = mk("path", { class: "nf" }, grp);
    items.push({ k, x, sil, head, hoops, bung, a: tween(REST[k]), last: NaN });
  }

  // a point on the cask at length yy, angle t, radius r, tipped by deg about its front-bottom edge
  function pt(it, yy, t, r, deg) {
    const s = Math.sin((deg * Math.PI) / 180), c = Math.cos((deg * Math.PI) / 180);
    const dy = yy - LEN, dz = RM + r * Math.sin(t);
    return { p: P(it.x + r * Math.cos(t), LEN + dy * c + dz * s, RZ + dz * c - dy * s), n: [Math.cos(t), Math.sin(t) * s, Math.sin(t) * c] };
  }
  const faces = (n) => n[0] * VIEW[0] + n[1] * VIEW[1] + n[2] * VIEW[2] > 0;

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const all = [], M = 36;
    for (const yy of [0, LEN * 0.2, LEN * 0.5, LEN * 0.8, LEN]) for (let i = 0; i < M; i++) all.push(pt(it, yy, (i / M) * Math.PI * 2, rOf(yy), deg).p);
    it.sil.setAttribute("d", poly(hull(all)));
    const ring = [];
    for (let i = 0; i < M; i++) ring.push(pt(it, LEN, (i / M) * Math.PI * 2, R - 1.2, deg).p);
    it.head.setAttribute("d", poly(ring));
    let d = "";
    for (const yy of [LEN * 0.22, LEN * 0.78]) {
      const arc = [];
      for (let i = 0; i <= 48; i++) { const q = pt(it, yy, (i / 48) * Math.PI * 2, rOf(yy), deg); if (faces(q.n)) arc.push(q.p); else if (arc.length) break; }
      if (arc.length > 1) d += open(arc);
    }
    it.hoops.setAttribute("d", d);
    const b = [];
    for (let i = 0; i < 12; i++) { const t = (i / 12) * Math.PI * 2; const q = pt(it, LEN / 2 + 2.2 * Math.sin(t), Math.PI / 2 + (2.2 * Math.cos(t)) / RM, RM + 0.3, deg); b.push(q.p); }
    it.bung.setAttribute("d", poly(b));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, LEN / 2, RZ + RM));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), to = a < 0 ? REST[k] : dd === 0 ? TIP : dd === 1 ? 6 : 0;
      tset(it.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cask " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "winebarrels",
  means: "Four casks on cradle rails: the cask under the pointer tips up on its front edge, and its neighbours tip a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[127, 131], [221, 181], [275, 207], null],
  mount,
});
