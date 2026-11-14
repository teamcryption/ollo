/**
 * Tapereels: a reel-to-reel tape deck lying on its back, two big reels on
 * their spindles and a head block between them at the front. The pointer
 * picks a reel: it lifts off its spindle and turns a part of a revolution as
 * it rises, and the other settles. At rest one reel is raised, bright. The
 * slider is how far a lifted reel turns.
 *
 * The pattern: one of a few, picked by nearest rest centre.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const DW = 150, DD = 84, DZ = 12, R = 30, RT = 5, LIFT = 24, FAV = 0;
const REELS = [[40, 38], [110, 38]];
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let turn = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[0, 0, 0], [DW, DD, 0], [DW, 0, 0], [0, DD, 0], [40, 38, DZ + LIFT + RT + 4], [110, 38, DZ + LIFT + RT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(0, 0, DW, DD, 6, 2);
  put(solid(g), prism(P, front, dr, di, 0, DZ));
  // spindles: a short post on the deck under each reel
  for (const [x, y] of REELS) put(solid(g), prism(P, front, disc(x, y, 3, 16), disc(x, y, 2, 16), DZ, DZ + RT + 3));

  const reels = REELS.map(([x, y], k) => {
    const grp = mk("g", {}, g), s = solid(grp);
    s.sil.classList.add("sil");
    const hub = mk("path", { class: "nf lo" }, grp), holes = [0, 1, 2].map(() => mk("path", { class: "nf lo" }, grp));
    return { k, x, y, s, hub, holes, o: tween(k === FAV ? 0.7 : 0), last: NaN };
  });
  // the head block between the reels, at the front edge
  const [hr, hi] = rings(62, 64, 88, 76, 3, 1.2);
  put(solid(g), prism(P, front, hr, hi, DZ, DZ + 10));

  function draw(it, o) {
    const key = o + turn * 1e-3;
    if (key === it.last) return;
    it.last = key;
    const z = DZ + 1 + o * LIFT, top = z + RT, a0 = (o * turn * Math.PI) / 180;
    put(it.s, prism(P, front, disc(it.x, it.y, R), disc(it.x, it.y, R - 2), z, top));
    it.hub.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, 7, 24), top)));
    it.holes.forEach((h, i) => {
      const a = a0 + (i * 2 * Math.PI) / 3, cx = it.x + 17 * Math.cos(a), cy = it.y + 17 * Math.sin(a);
      h.setAttribute("d", poly(ringAt(P, disc(cx, cy, 6.5, 24), top)));
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of reels) { draw(it, tval(it.o, now)); if (!tdone(it.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = reels.map((it) => P(it.x, it.y, DZ + RT));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, (m[1] - sy) * 1.6); if (dd < bd) { bd = dd; best = k; } });
    return bd < 56 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    const on = a < 0 ? FAV : a;
    reels.forEach((it, k) => {
      tset(it.o, a < 0 ? (k === FAV ? 0.7 : 0) : k === a ? 1 : 0, now, 0);
      it.s.sil.classList.toggle("hi", k === on);
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "supply" : "take-up";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { turn = v; for (const it of reels) it.last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "tapereels",
  means: "A reel-to-reel tape deck: the reel under the pointer lifts off its spindle, turning as it rises.",
  rules: [1, 5, 6, 8],
  range: [0, 60, 120],
  tour: [[163, 126], [247, 168], [165, 140], null],
  mount,
});
