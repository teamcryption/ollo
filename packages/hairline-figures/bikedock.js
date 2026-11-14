/**
 * Bike share dock: four bicycles locked nose-in to a row of dock posts. The
 * pointer picks a bike by where it stands: it rolls back out of its dock,
 * and the bikes beside it give a little, staggered from it. At rest one bike
 * stands half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 26, WR = 8.5, OUT = 18, CZ = 3, PH = 24, FAV = 1;
const X1 = (N - 1) * STEP + 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-8, -4, 0], [X1 + 8, 72, 0], [X1 + 8, -4, 0], [-8, 72, 0], [8, 4, CZ + PH + 2], [X1, 4, CZ + PH + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-8, -4, X1 + 8, 72, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, CZ));
  // the rail the posts stand on
  const [rr, ri] = rings(-2, 0, X1 + 2, 8, 3, 1);
  put(solid(g), prism(P, front, rr, ri, CZ, CZ + 3));

  const wheel = (x, y, r, z) => { const pts = []; for (let i = 0; i < 32; i++) { const t = (i / 32) * 2 * Math.PI; pts.push(P(x, y + r * Math.cos(t), z + r * Math.sin(t))); } return pts; };
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 8 + k * STEP;
    const [pr, pi] = rings(x - 3.5, 1, x + 3.5, 7, 2.5, 1);
    const post = solid(g);
    put(post, prism(P, front, pr, pi, CZ + 3, CZ + PH));
    const it = { k, x, post, last: NaN, s: tween(k === FAV ? OUT * 0.6 : 0), grp: mk("g", {}, g) };
    it.dot = mk("circle", { r: 1.6, class: "dot off" }, g);
    const [dx, dy] = P(x, 7, CZ + PH - 5);
    it.dot.setAttribute("cx", dx); it.dot.setAttribute("cy", dy);
    it.rear = mk("path", { class: "nf sil" }, it.grp);
    it.front = mk("path", { class: "nf sil" }, it.grp);
    it.tyres = mk("path", { class: "nf lo" }, it.grp);
    it.frame = mk("path", { class: "nf" }, it.grp);
    items.push(it);
  }

  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    const x = it.x, y = 14 + s, z = CZ + WR, ry = y + 30;
    it.front.setAttribute("d", poly(wheel(x, y, WR, z)));
    it.rear.setAttribute("d", poly(wheel(x, ry, WR, z)));
    it.tyres.setAttribute("d", poly(wheel(x, y, WR - 1.6, z)) + poly(wheel(x, ry, WR - 1.6, z)));
    const bb = P(x, y + 17, CZ + 6), seat = P(x, y + 23, CZ + 22), head = P(x, y + 4, CZ + 21);
    it.frame.setAttribute("d", open([P(x, ry, z), bb, seat, head, bb]) + open([P(x, ry, z), seat]) + open([P(x, y, z), head, P(x, y + 5, CZ + 25)])
      + open([P(x - 5, y + 6, CZ + 25), P(x + 5, y + 6, CZ + 25)]) + open([P(x, y + 20, CZ + 23), P(x, y + 27, CZ + 23)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.s, now)); if (!tdone(it.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // each bay's rest axis, rear wheel to post top: fixed, so the hit never moves
  const axes = items.map((it) => [P(it.x, 48, CZ), P(it.x, 4, CZ + PH)]);
  function hit([sx, sy]) {
    let best = -1, bd = 16;
    axes.forEach(([a, b], k) => {
      const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((sx - a[0]) * dx + (sy - a[1]) * dy) / (dx * dx + dy * dy)));
      const dd = Math.hypot(sx - a[0] - t * dx, sy - a[1] - t * dy);
      if (dd < bd) { bd = dd; best = k; }
    });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act, on = a < 0 ? FAV : a;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), s = a < 0 ? (k === FAV ? OUT * 0.6 : 0) : dd === 0 ? OUT : dd === 1 ? 3 : 0;
      tset(it.s, s, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.rear.classList.toggle("hi", k === on);
      it.front.classList.toggle("hi", k === on);
      it.dot.setAttribute("class", k === on ? "dot m" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : "bay " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bikedock",
  means: "Four share bikes locked nose-in to dock posts: the bike under the pointer rolls back out of its bay; its neighbours give a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[149, 138], [187, 157], [262, 195], null],
  mount,
});
