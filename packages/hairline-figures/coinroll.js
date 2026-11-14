/**
 * Coin wrapper: five paper-wrapped coin rolls standing in a shallow tray,
 * each crimped at both ends. The pointer picks a roll by where it stands:
 * it rises out of the tray and the rolls beside it nudge up, staggered from
 * it. At rest one roll stands proud, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, open, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 24, R = 9.5, LIFT = 20, FAV = 2, TZ = 4;
const H = [34, 40, 30, 37, 32];
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-7, -7, 0], [X1 + 7, 2 * R + 7, 0], [X1 + 7, -7, 0], [-7, 2 * R + 7, 0], [R + STEP, R, TZ + 40 + LIFT], [X1 - R, R, TZ + 37 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-7, -7, X1 + 7, 2 * R + 7, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  const [wr, wi] = rings(-4, -4, X1 + 4, 2 * R + 4, 4, 1.2);
  mk("path", { d: open(ringAt(P, run(wi, (q) => !front(q)), TZ - 0.01)), class: "nf lo" }, g);
  void wr;

  const rest = (k) => (k === FAV ? 9 : 0);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g), s = solid(grp);
    const ring = disc(x, y, R), inner = disc(x, y, R - 1.4), fr = run(ring, front);
    const c1 = mk("path", { class: "nf lo" }, grp), c2 = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, s, ring, inner, fr, c1, c2, z: tween(rest(k)), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = TZ + lift, z1 = z0 + H[it.k];
    put(it.s, prism(P, front, it.ring, it.inner, z0, z1));
    it.c1.setAttribute("d", open(ringAt(P, it.fr, z0 + 4)));
    it.c2.setAttribute("d", open(ringAt(P, it.fr, z1 - 4)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, TZ + H[it.k] / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? rest(k) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "roll " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "coinroll",
  means: "Five wrapped coin rolls in a tray: the roll under the pointer rises out, and its neighbours nudge up after it.",
  rules: [1, 2, 5, 9],
  range: [0, 40, 80],
  tour: [[130, 136], [165, 153], [270, 205], null],
  mount,
});
