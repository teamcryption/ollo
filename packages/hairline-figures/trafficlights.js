/**
 * Traffic lights: four signal posts along a kerb, each head a rounded box
 * with three lamps on its face. At rest the heads stand turned at uneven
 * angles; the head under the pointer turns to face the viewer, its
 * neighbours turn a little toward it, staggered. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, KZ = 3, PZ = 34, HZ = 62, FAV = 2;
const REST = [-10, -95, -20, -80], FACE = -45;
const X1 = (N - 1) * STEP + 24;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const turn = (ring, x, y, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [X1 + 4, 24, 0], [X1 + 4, -4, 0], [-4, 24, 0], [12, 10, HZ + 2], [X1 - 12, 10, HZ + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [kr, ki] = rings(-4, -4, X1 + 4, 24, 5, 2);
  put(solid(g), prism(P, front, kr, ki, 0, KZ));
  const [hr, hi] = rings(-6, -3.2, 6, 3.2, 2.2, 1.1);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 12 + k * STEP, y = 10, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, 1.6), disc(x, y, 0.8), KZ, PZ));
    const head = solid(grp);
    const lamps = [0, 1, 2].map((j) => mk("circle", { r: 2.4, class: j === 0 && k === FAV ? "dot" : "dot off" }, grp));
    items.push({ k, x, y, head, lamps, a: tween(REST[k]), last: NaN });
  }

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = (deg * Math.PI) / 180;
    put(it.head, prism(P, front, turn(hr, it.x, it.y, a), turn(hi, it.x, it.y, a), PZ, HZ));
    const fx = it.x - 3.4 * Math.sin(a), fy = it.y + 3.4 * Math.cos(a);
    it.lamps.forEach((l, j) => place(l, P(fx, fy, HZ - 6 - j * 8.5)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, (PZ + HZ) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), to = a < 0 ? REST[k] : dd === 0 ? FACE : REST[k] + (FACE - REST[k]) * (dd === 1 ? 0.4 : 0);
      tset(it.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.head.sil.classList.toggle("hi", on);
      it.lamps.forEach((l, j) => l.setAttribute("class", on && j === (a < 0 ? 0 : k % 3) ? "dot" : "dot off"));
    });
    read.textContent = a < 0 ? "rest" : "sig " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "trafficlights",
  means: "Four signal posts on a kerb: the head under the pointer turns to face you, one lamp lit, and its neighbours turn a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[176, 112], [224, 136], [128, 88], null],
  mount,
});
