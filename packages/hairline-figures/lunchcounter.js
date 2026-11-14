/**
 * Lunch counter: a diner counter with four swivel stools in front of it. The
 * pointer picks a stool by where it stands: it swivels round to face the
 * viewer, and the stools beside it turn a little after it, staggered by
 * distance. At rest one stool sits turned out, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row, answering with a turn.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 22, SY = 34, SZ = 17, FAV = 2, X0 = 14, L = X0 * 2 + (N - 1) * STEP;
const REST = [100, 80, -60, 95];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [L, 0, 0], [0, SY + 8, 0], [L, SY + 8, 0], [0, 0, 30], [L, 0, 30], [0, SY + 8, SZ + 20], [L, SY + 8, SZ + 20]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 2, L, 14, 2, 1.2);
  put(solid(g), prism(P, front, cr, ci, 0, 26));
  const [tr, ti] = rings(-3, -1, L + 3, 18, 3, 1.6);
  put(solid(g), prism(P, front, tr, ti, 26, 29));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, SY, 6), disc(x, SY, 5), 0, 1.5));
    put(solid(grp), prism(P, front, disc(x, SY, 1.4, 12), disc(x, SY, 0.8, 12), 1.5, SZ));
    const seat = solid(grp);
    put(seat, prism(P, front, disc(x, SY, 7.5, 32), disc(x, SY, 6.3, 32), SZ, SZ + 3));
    const back = mk("path", { class: "sil" }, grp);
    items.push({ k, x, seat, back, a: tween(REST[k]), last: NaN });
  }

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = ((a - 75 + i * 15) * Math.PI) / 180;
      for (const r of [7.2, 6]) for (const z of [SZ + 3, SZ + 19]) pts.push(P(it.x + r * Math.cos(t), SY + r * Math.sin(t), z));
    }
    it.back.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, SY, SZ / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(it.a, a < 0 ? REST[k] : dd === 0 ? -90 : dd === 1 ? REST[k] + (k > a ? 80 : -80) : REST[k] + (k > a ? 40 : -40), now, d);
      const on = k === (a < 0 ? FAV : a);
      it.back.classList.toggle("hi", on);
      it.seat.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "stool " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "lunchcounter",
  means: "A diner counter with four swivel stools: the stool under the pointer swivels round to face you, its neighbours turn a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[119, 163], [158, 183], [235, 222], null],
  mount,
});
