/**
 * Campfire: a ring of stones round two crossed logs, five flames standing
 * on the logs. The pointer picks a flame by where it stands on the fire: it
 * leaps up, and the flames beside it rise a little, staggered from it. At
 * rest the flames stand at uneven heights, the tallest bright. The slider is
 * the stagger.
 *
 * The pattern: one of many on the ground (terrain), picked by world position.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const FZ = 11, FAV = 2, TALL = 44;
const FL = [[-8, -6], [6, -8], [0, 0], [-6, 8], [8, 6]];
const REST = [13, 17, 26, 15, 10];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[-32, -32, 0], [32, 32, 0], [32, -32, 0], [-32, 32, 0], [0, 0, FZ + TALL]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const stones = [];
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2 + 0.3; stones.push([27 * Math.cos(a), 27 * Math.sin(a), 4 + (i % 3)]); }
  stones.sort((a, b) => a[0] + a[1] - b[0] - b[1]);
  const stone = ([x, y, r]) => put(solid(g), prism(P, front, disc(x, y, r), disc(x, y, r - 1.2), 0, 3 + r * 0.5));
  stones.filter((s) => s[0] + s[1] < 0).forEach(stone);
  const [lr, li] = rings(-22, -3, 22, 3, 3, 1);
  put(solid(g), prism(P, front, lr, li, 0, 6));
  const [mr, mi] = rings(-3, -22, 3, 22, 3, 1);
  put(solid(g), prism(P, front, mr, mi, 5, 11));

  const order = FL.map((f, k) => k).sort((a, b) => FL[a][0] + FL[a][1] - FL[b][0] - FL[b][1]);
  const items = [];
  for (const k of order) items[k] = { k, s: solid(g), h: tween(REST[k]), last: NaN };
  stones.filter((s) => s[0] + s[1] >= 0).forEach(stone);

  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    const [x, y] = FL[it.k];
    const pts = ringAt(P, disc(x, y, 5), FZ).concat(ringAt(P, disc(x + 0.5, y, 4.2), FZ + h * 0.35), ringAt(P, disc(x + 1, y, 0.8, 8), FZ + h));
    it.s.sil.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.h, now)); if (!tdone(it.h, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, FZ);
    let best = -1, bd = Infinity;
    FL.forEach(([x, y], k) => { const dd = Math.hypot(x - wx, y - wy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 9 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = a < 0 ? 0 : Math.hypot(FL[k][0] - FL[a][0], FL[k][1] - FL[a][1]);
      const h = a < 0 ? REST[k] : k === a ? TALL : Math.max(8, 22 - dd);
      const df = from < 0 ? 0 : Math.hypot(FL[k][0] - FL[from][0], FL[k][1] - FL[from][1]) / 10;
      tset(it.h, h, now, df * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "flame " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "campfire",
  means: "Five flames on crossed logs in a stone ring: the flame under the pointer leaps up, and the ones beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[195, 159], [234, 174], [205, 193], null],
  mount,
});
