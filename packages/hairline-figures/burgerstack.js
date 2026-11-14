/**
 * Burger: a bun, patty, cheese, lettuce, tomato and a domed top bun on a
 * board. The pointer picks a layer by its height: that layer slides out
 * toward the viewer, and the layers next to it follow a little, staggered
 * from it. At rest the cheese sticks out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single column, picked by rest height.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, ringAt, rings, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SL = 15, FAV = 2;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const wavy = (x, y, r) => circ(r, 64).map((q, i) => { const k = 1 + 0.07 * Math.sin(i * Math.PI / 4); return { ...q, u: x + q.nu * r * k, v: y + q.nv * r * k }; });
// [name, thickness, ring(dx, dy), inner(dx, dy)]
const LAYERS = [
  ["bun", 7, (x, y) => disc(x, y, 24), (x, y) => disc(x, y, 22)],
  ["patty", 6, (x, y) => disc(x, y, 25.5), (x, y) => disc(x, y, 23.5)],
  ["cheese", 1.6, (x, y) => rrect(x - 22, y - 22, x + 22, y + 22, 1.5, 4), (x, y) => rrect(x - 21, y - 21, x + 21, y + 21, 0.8, 4)],
  ["leaf", 1.8, (x, y) => wavy(x, y, 26), (x, y) => disc(x, y, 23)],
  ["tomato", 2.8, (x, y) => disc(x, y, 21), (x, y) => disc(x, y, 18)],
  ["top", 0, null, null],
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.0);
  const H = 4 + LAYERS.reduce((s, l) => s + l[1], 0) + 18;
  fit(C, [[-36, -36, 0], [36 + SL, 36 + SL, 0], [36, -36, 0], [-36, 36, 0], [0, 0, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-36, -36, 36, 36, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, 4));

  let z = 4;
  const items = LAYERS.map(([name, th, ring, inner], k) => {
    const it = { k, name, th, ring, inner, z0: z, s: solid(mk("g", {}, g)), off: tween(0), last: NaN };
    z += th;
    return it;
  });

  function draw(it, o) {
    if (o === it.last) return;
    it.last = o;
    const d = o / Math.SQRT2;
    if (it.ring) { put(it.s, prism(P, front, it.ring(d, d), it.inner(d, d), it.z0, it.z0 + it.th)); return; }
    // the top bun: a dome over a short wall
    const base = it.z0, pts = [];
    for (let i = 0; i <= 7; i++) { const t = (i / 7) * (Math.PI / 2); pts.push(...ringAt(P, disc(d, d, 24 * Math.cos(t), 32), base + 3 + 15 * Math.sin(t))); }
    pts.push(...ringAt(P, disc(d, d, 24, 32), base));
    put(it.s, { sil: poly(hull(pts)), crease: open(ringAt(P, run(disc(d, d, 23, 40), front), base + 3)) });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.off, now)); if (!tdone(it.off, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit: the pointer's screen y against each layer's rest middle
  const mids = items.map((it) => P(0, 0, it.z0 + (it.th || 9) / 2));
  const axis = P(0, 0, 0)[0];
  function hit([sx, sy]) {
    if (Math.abs(sx - axis) > 80) return -1;
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 24 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), o = a < 0 ? (k === FAV ? 6 : 0) : dd === 0 ? SL : dd === 1 ? 3 : 0;
      tset(it.off, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : items[a].name;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "burgerstack",
  means: "A burger on a board, layer by layer: the layer under the pointer slides out toward you, and the ones beside it follow a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[200, 150], [200, 126], [200, 87], null],
  mount,
});
