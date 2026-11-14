/**
 * Sushi conveyor: a stadium-shaped counter with its belt track inset round
 * the edge, eight small plates riding the loop with a piece on each, spaced
 * unevenly where one has been taken. The pointer picks the plate under it,
 * read on the belt's top: it lifts off the belt, and the plates beside it
 * along the loop rise a little, staggered from it. At rest one plate is
 * held up, bright. The slider is the stagger.
 *
 * The pattern: picked on a fixed plane (terrain), stagger along the loop.
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, rrect, ringAt, open, poly, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 170, D = 74, RR = 37, BZ = 7, PRAD = 9, LIFT = 22, FAV = 2;
const SLOTS = [0, 1, 2, 3, 5, 6, 7, 8];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

// a point at fraction f round the track's centreline
function along(f) {
  const r = RR - 11, L = W - 2 * RR, per = 2 * L + 2 * Math.PI * r;
  let s = (((f % 1) + 1) % 1) * per;
  if (s < L) return [RR + s, D / 2 + r];
  s -= L;
  if (s < Math.PI * r) { const a = Math.PI / 2 - s / r; return [W - RR + r * Math.cos(a), D / 2 + r * Math.sin(a)]; }
  s -= Math.PI * r;
  if (s < L) return [W - RR - s, D / 2 - r];
  s -= L;
  const a = -Math.PI / 2 - s / r;
  return [RR + r * Math.cos(a), D / 2 + r * Math.sin(a)];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [W / 2, 0, BZ + LIFT + 12], [0, D / 2, BZ + LIFT + 12]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [o, oi] = rings(0, 0, W, D, RR, 1.6);
  put(solid(g), prism(P, front, o, oi, 0, BZ));
  mk("path", { d: open(ringAt(P, rrect(20, 20, W - 20, D - 20, RR - 20, 10), BZ).concat([P(20, D / 2, BZ)])), class: "nf lo" }, g);

  const items = SLOTS.map((s, k) => {
    const [x, y] = along(s / 9 + 0.02);
    return { k, x, y, z: tween(k === FAV ? LIFT * 0.7 : k % 3 === 1 ? 2 : 0), last: NaN, roll: k % 2 === 0 };
  });
  const order = items.slice().sort((a, b) => a.x + a.y - (b.x + b.y));
  for (const it of order) {
    it.grp = mk("g", {}, g);
    mk("path", { d: poly(ringAt(P, disc(it.x, it.y, PRAD, 28), BZ)), class: "nf dash" }, it.grp);
    it.plate = solid(it.grp); it.plate.sil.classList.add("sil");
    it.dish = solid(it.grp);
  }

  function draw(it, z) {
    if (z === it.last) return;
    it.last = z;
    const z0 = BZ + 0.2 + z;
    put(it.plate, prism(P, front, disc(it.x, it.y, PRAD), disc(it.x, it.y, PRAD - 2.4), z0, z0 + 1.6));
    if (it.roll) put(it.dish, prism(P, front, disc(it.x, it.y, 4.6, 24), disc(it.x, it.y, 3.2, 24), z0 + 1.6, z0 + 6));
    else { const [a, b] = rings(it.x - 6, it.y - 3, it.x + 6, it.y + 3, 3, 1); put(it.dish, prism(P, front, a, b, z0 + 1.6, z0 + 5)); }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, BZ);
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const dd = Math.hypot(it.x - wx, it.y - wy); if (dd < bd) { bd = dd; best = k; } });
    return bd < PRAD + 4 ? best : -1;
  }

  let act = -2;
  const ring = (a, b) => { const d = Math.abs(a - b); return Math.min(d, items.length - d); };
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = ring(k, a), to = a < 0 ? (k === FAV ? LIFT * 0.7 : k % 3 === 1 ? 2 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, to, now, from < 0 ? 0 : ring(k, from) * stag);
      it.plate.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    for (const it of order) g.appendChild(it.grp);
    g.appendChild(items[a < 0 ? FAV : a].grp);
    read.textContent = a < 0 ? "rest" : "plate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "sushiconveyor",
  means: "A loop of plates on a sushi belt: the plate under the pointer lifts off the belt, and the plates beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[112, 170], [165, 196], [261, 177], null],
  mount,
});
