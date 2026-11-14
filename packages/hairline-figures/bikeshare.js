/**
 * Bike share dock: a row of locking posts on a ground rail, a bike clipped
 * into each by its front wheel. The pointer picks a bike by screen x: it
 * unlocks and rolls back out of its dock, and the bikes beside it rock a
 * little, staggered from it. At rest one bike stands half out, bright, and
 * one dock is empty. The slider is the stagger.
 */
const {
  Cam, fit, facing, open, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 34, R = 10, OUT = 46, FAV = 1, GAP = 3;
const REST = [0.06, 0.5, 0, 0.1, 0.03];
const L = (N - 1) * STEP + 24;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-4, -10, 34], [L, -10, 0], [L, 50 + OUT, 0], [0, 50 + OUT, 30], [L, 0, 34]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -12, L, -4, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  const items = [], pg = mk("g", {}, g), bg = mk("g", {}, g);
  for (let k = 0; k < N; k++) {
    const x = 12 + k * STEP;
    const [pr, pi] = rings(x - 3, -11, x + 3, -5, 2, 0.8);
    const post = solid(mk("g", {}, pg));
    put(post, prism(P, front, pr, pi, 3, 26));
    const grp = mk("g", {}, bg);
    const wheels = mk("path", { class: "nf" }, grp), frame = mk("path", { class: "sil nf" }, grp);
    items.push({ k, x, grp, wheels, frame, empty: k === GAP, t: tween(REST[k]), last: NaN });
  }

  const wheel = (x, y, z) => { const pts = []; for (let i = 0; i <= 24; i++) { const a = (i / 24) * 2 * Math.PI; pts.push(P(x, y + R * Math.cos(a), z + R * Math.sin(a))); } return open(pts); };
  function draw(it, v) {
    if (v === it.last) return;
    it.last = v;
    if (it.empty) return;
    const x = it.x, y = 2 + v * OUT, F = (dy, z) => P(x, y + dy, z);
    it.wheels.setAttribute("d", wheel(x, y + 10, R) + wheel(x, y + 40, R));
    const hub = F(10, R), bb = F(26, 9), seat = F(34, 28), head = F(14, 27), bar = F(12, 33), rear = F(40, R);
    it.frame.setAttribute("d", open([rear, bb, seat, rear]) + open([bb, head, hub]) + open([seat, head, bar]) + open([F(36, 28), F(32, 30)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 26, 14));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 70 && !items[best].empty ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), v = a < 0 ? REST[k] : d === 0 ? 1 : d === 1 ? 0.12 : 0.02;
      tset(it.t, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.frame.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "dock " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bikeshare",
  means: "A bike share dock: the bike under the pointer unlocks and rolls back out of its post, and its neighbours rock a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[135, 118], [222, 161], [308, 204], null],
  mount,
});
